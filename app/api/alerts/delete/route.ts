import { json, readJson, rejectCrossSite, serverError } from "../../../../lib/auth/http";
import { getSessionUser } from "../../../../lib/auth/session";
import { deleteForUser } from "../../../../lib/store";

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const b = await readJson(req);
  const id = String(b?.id ?? "");
  if (!/^[a-f0-9]{16}$/.test(id)) return json({ error: "Invalid alert." }, 400);
  try {
    const removed = await deleteForUser(user.id, id);
    return removed ? json({ ok: true }) : json({ error: "Alert not found." }, 404);
  } catch (e) {
    return serverError("delete alert", e);
  }
}
