import { getModel } from "../../../data/models";
import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../lib/auth/http";
import { hit } from "../../../lib/auth/rate";
import { getSessionUser } from "../../../lib/auth/session";
import { MAX_SAVED, countSaved, listSaved, saveModel, unsaveModel } from "../../../lib/saved";

// Watchlist for signed-in users. GET lists saved slugs; POST {slug, saved:boolean} toggles.
export async function GET() {
  const user = await getSessionUser().catch(() => null);
  if (!user) return json({ signedIn: false, saved: [] });
  try {
    return json({ signedIn: true, saved: await listSaved(user.id) });
  } catch (e) {
    return serverError("list saved", e);
  }
}

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const user = await getSessionUser();
  if (!user) return json({ error: "Log in to save models." }, 401);
  const body = await readJson(req);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  if (!getModel(slug) || typeof body?.saved !== "boolean") return json({ error: "Invalid request." }, 400);
  try {
    if (await hit(`saved:${user.id}`, 60, 600)) return tooMany();
    if (body.saved) {
      if ((await countSaved(user.id)) >= MAX_SAVED) return json({ error: `You can save up to ${MAX_SAVED} models.` }, 422);
      await saveModel(user.id, slug);
    } else {
      await unsaveModel(user.id, slug);
    }
    return json({ ok: true, saved: body.saved });
  } catch (e) {
    return serverError("toggle saved", e);
  }
}
