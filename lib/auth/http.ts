import { NextResponse } from "next/server";
import { reportError } from "../monitoring";
import { SITE } from "../site";

/**
 * CSRF defence for state-changing requests: the browser must send an Origin that is this
 * site, and the body must be JSON (which cross-site HTML forms cannot send). SameSite=Lax
 * cookies are the second layer.
 */
export function rejectCrossSite(req: Request): NextResponse | null {
  const origin = req.headers.get("origin");
  const allowed = new Set([new URL(req.url).origin, new URL(SITE.url).origin]);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) allowed.add(`${new URL(req.url).protocol}//${host}`);
  if (!origin || !allowed.has(origin)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }
  return null;
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = await req.json();
    return b && typeof b === "object" && !Array.isArray(b) ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const tooMany = (msg = "Too many attempts. Please wait a few minutes and try again.") => json({ error: msg }, 429);

export const serverError = (where: string, e: unknown) => {
  reportError(e, { where: `api:${where}` });
  return json({ error: "Something went wrong on our side. Please try again in a moment." }, 503);
};
