import { NextResponse } from "next/server";
import { absoluteUrl } from "../../../../lib/site";
import { getStore } from "../../../../lib/store";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  let ok = false;
  try {
    ok = token.length > 10 && (await getStore().confirm(token));
  } catch (e) {
    console.error("[alerts] confirm failed", e);
  }
  return NextResponse.redirect(absoluteUrl(`/alerts?status=${ok ? "confirmed" : "invalid"}`), 303);
}
