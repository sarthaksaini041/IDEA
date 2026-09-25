import { json, rejectCrossSite, serverError } from "../../../../lib/auth/http";
import { endSession } from "../../../../lib/auth/session";

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  try {
    await endSession();
    return json({ ok: true });
  } catch (e) {
    return serverError("logout", e);
  }
}
