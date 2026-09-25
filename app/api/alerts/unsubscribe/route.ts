import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";

export async function POST(req: Request) {
  let token = "";
  try {
    token = String(((await req.json()) as { token?: string }).token || "");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  try {
    const removed = token.length > 10 && (await getStore().removeByToken(token));
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    console.error("[alerts] unsubscribe failed", e);
    return NextResponse.json({ error: "Could not process the request. Try again later." }, { status: 503 });
  }
}
