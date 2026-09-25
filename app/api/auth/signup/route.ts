import { dbConfigured } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth/crypto";
import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { sendCode } from "../../../../lib/auth/mail";
import { clientIp, hit } from "../../../../lib/auth/rate";
import { cooldownRemaining, createUser, findUserByEmail, issueCode, resetUnverifiedUser } from "../../../../lib/auth/users";
import { checkEmail, checkName, checkPassword, normEmail, type Errors } from "../../../../lib/auth/validate";
import { emailConfigured } from "../../../../lib/email";

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);

  const name = String(b.name ?? "").trim().replace(/\s+/g, " ");
  const email = normEmail(b.email);
  const password = String(b.password ?? "");
  const errors: Errors = {};
  checkName(name, errors);
  checkEmail(email, errors);
  checkPassword(password, email, errors);
  if (Object.keys(errors).length) return json({ errors }, 422);
  if (!dbConfigured()) return json({ error: "Accounts are not available yet." }, 503);

  try {
    if (await hit(`signup:ip:${clientIp(req)}`, 10, 3600)) return tooMany();

    let user = await findUserByEmail(email);
    if (user?.email_verified_at) {
      return json({ errors: { email: "An account with this email already exists. Log in instead." } }, 409);
    }
    const hash = await hashPassword(password);
    if (user) {
      await resetUnverifiedUser(user.id, name, hash);
      const wait = await cooldownRemaining(user.id, "verify");
      if (wait > 0) return json({ ok: true, email, cooldown: wait });
    } else {
      user = await createUser(email, name, hash);
    }
    if (await hit(`code:${email}`, 6, 3600)) return tooMany("Too many codes requested. Try again in an hour.");
    const code = await issueCode(user.id, "verify");
    const sent = await sendCode(email, name, code, "verify");
    if (!sent && emailConfigured()) return json({ error: "We couldn't send the code email. Please try again shortly." }, 503);
    return json({ ok: true, email });
  } catch (e) {
    // Two simultaneous signups for one email: the unique index wins, the loser retries.
    if ((e as { code?: string }).code === "23505") return json({ error: "Please try again." }, 409);
    return serverError("signup", e);
  }
}
