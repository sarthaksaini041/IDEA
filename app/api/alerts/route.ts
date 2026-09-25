import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../lib/auth/http";
import { hit } from "../../../lib/auth/rate";
import { getSessionUser } from "../../../lib/auth/session";
import { MAX_ALERTS_PER_USER, countForUser, createAlert } from "../../../lib/store";
import { validateAlert } from "../../../lib/validate";

// Creating an alert needs a verified account; the account's email receives the alerts.
export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in to create price alerts." }, 401);
  const body = await readJson(req);
  if (!body) return json({ error: "Invalid request." }, 400);
  const v = validateAlert(body);
  if (!v.ok) return json({ errors: v.errors }, 422);

  try {
    if (await hit(`alert-create:${user.id}`, 20, 3600)) return tooMany();
    if ((await countForUser(user.id)) >= MAX_ALERTS_PER_USER) {
      return json({ errors: { form: `You can have up to ${MAX_ALERTS_PER_USER} alerts. Delete one to add another.` } }, 422);
    }
    const alert = await createAlert(user, v.value);
    return json({ ok: true, id: alert.id }, 201);
  } catch (e) {
    return serverError("create alert", e);
  }
}
