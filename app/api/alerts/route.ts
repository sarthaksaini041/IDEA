import { NextResponse } from "next/server";
import { getModel } from "../../../data/models";
import { sendEmail, emailConfigured } from "../../../lib/email";
import { absoluteUrl } from "../../../lib/site";
import { getStore } from "../../../lib/store";
import { validateAlert } from "../../../lib/validate";

const MAX_ALERTS_PER_EMAIL = 5;
// Best-effort per-instance rate limit; put a WAF/edge limit in front for real abuse.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const v = validateAlert(body);
  if (!v.ok) return NextResponse.json({ errors: v.errors }, { status: 422 });

  try {
    const store = getStore();
    if ((await store.countByEmail(v.value.email)) >= MAX_ALERTS_PER_EMAIL) {
      return NextResponse.json({ errors: { email: `Limit of ${MAX_ALERTS_PER_EMAIL} alerts per email.` } }, { status: 422 });
    }
    const alert = await store.create(v.value);
    const model = getModel(alert.modelSlug)!;
    await sendEmail(
      alert.email,
      `Confirm your price alert: ${model.shortName}`,
      [
        `You asked to be emailed when a ${model.name} is listed at or under ${alert.maxPrice} on ${alert.marketplace.replace("_", " ")}.`,
        ``,
        `Confirm: ${absoluteUrl(`/api/alerts/confirm?token=${alert.token}`)}`,
        ``,
        `If this wasn't you, ignore this email and nothing will be sent.`,
        `Unsubscribe any time: ${absoluteUrl(`/alerts/unsubscribe?token=${alert.token}`)}`,
      ].join("\n"),
    );
    return NextResponse.json({ ok: true, needsConfirmation: true, emailSent: emailConfigured() }, { status: 201 });
  } catch (e) {
    console.error("[alerts] create failed", e);
    return NextResponse.json({ error: "Could not save your alert right now. Please try again later." }, { status: 503 });
  }
}
