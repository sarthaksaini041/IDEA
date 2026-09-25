import { json, readJson, rejectCrossSite, serverError } from "../../../../lib/auth/http";
import { removeByToken } from "../../../../lib/store";

// One-click removal from an alert email; the secret token is the credential.
export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  const token = String(b?.token ?? "");
  if (token.length < 20 || token.length > 100) return json({ ok: true, removed: false });
  try {
    return json({ ok: true, removed: await removeByToken(token) });
  } catch (e) {
    return serverError("unsubscribe", e);
  }
}
