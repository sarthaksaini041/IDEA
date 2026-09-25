import { dummyHash, verifyPassword } from "../../../../lib/auth/crypto";
import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { sendCode } from "../../../../lib/auth/mail";
import { clear, clientIp, hit, isLimited } from "../../../../lib/auth/rate";
import { startSession } from "../../../../lib/auth/session";
import { cooldownRemaining, findUserByEmail, issueCode } from "../../../../lib/auth/users";
import { normEmail } from "../../../../lib/auth/validate";

const INVALID = { errors: { form: "Incorrect email or password." } };

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);
  const email = normEmail(b.email);
  const password = String(b.password ?? "");
  if (!email || !password || password.length > 128) return json(INVALID, 401);

  try {
    const ip = clientIp(req);
    // Per-IP ceiling, plus a per-account lock after repeated failures (guessing protection).
    if (await hit(`login:ip:${ip}`, 30, 900)) return tooMany();
    if (await isLimited(`login:fail:${email}`, 8, 900)) return tooMany("Too many failed attempts. Try again in 15 minutes or reset your password.");

    const user = await findUserByEmail(email);
    const ok = await verifyPassword(password, user?.password_hash ?? (await dummyHash()));
    if (!user || !ok) {
      await hit(`login:fail:${email}`, 8, 900);
      return json(INVALID, 401);
    }
    await clear(`login:fail:${email}`);

    if (!user.email_verified_at) {
      // Correct password but email never confirmed: send a fresh code and finish at /verify.
      if ((await cooldownRemaining(user.id, "verify")) === 0) {
        const code = await issueCode(user.id, "verify");
        await sendCode(email, user.name, code, "verify");
      }
      return json({ needsVerification: true, email }, 403);
    }
    await startSession(user.id);
    return json({ ok: true });
  } catch (e) {
    return serverError("login", e);
  }
}
