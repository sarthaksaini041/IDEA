import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { sendCode } from "../../../../lib/auth/mail";
import { clientIp, hit } from "../../../../lib/auth/rate";
import { cooldownRemaining, findUserByEmail, issueCode, type Purpose } from "../../../../lib/auth/users";
import { normEmail } from "../../../../lib/auth/validate";

// Always answers the same way for unknown emails, so it can't be used to discover accounts.
export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);
  const email = normEmail(b.email);
  const purpose: Purpose = b.purpose === "reset" ? "reset" : "verify";

  try {
    if (await hit(`resend:ip:${clientIp(req)}`, 10, 900)) return tooMany();
    const user = await findUserByEmail(email);
    const eligible = user && (purpose === "reset" || !user.email_verified_at);
    if (!user || !eligible) return json({ ok: true });

    const wait = await cooldownRemaining(user.id, purpose);
    if (wait > 0) return json({ ok: true, cooldown: wait });
    if (await hit(`code:${email}`, 6, 3600)) return tooMany("Too many codes requested. Try again in an hour.");
    const code = await issueCode(user.id, purpose);
    await sendCode(email, user.name, code, purpose);
    return json({ ok: true });
  } catch (e) {
    return serverError("resend", e);
  }
}
