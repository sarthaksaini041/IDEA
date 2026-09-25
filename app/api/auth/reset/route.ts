import { hashPassword } from "../../../../lib/auth/crypto";
import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { clear, clientIp, hit } from "../../../../lib/auth/rate";
import { endAllSessions, startSession } from "../../../../lib/auth/session";
import { consumeCode, findUserByEmail, markVerified, setPassword } from "../../../../lib/auth/users";
import { CODE_RE, checkPassword, normEmail, type Errors } from "../../../../lib/auth/validate";

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);
  const email = normEmail(b.email);
  const code = String(b.code ?? "").replace(/\s/g, "");
  const password = String(b.password ?? "");
  const errors: Errors = {};
  if (!CODE_RE.test(code)) errors.code = "Enter the 6-digit code from the email.";
  checkPassword(password, email, errors);
  if (Object.keys(errors).length) return json({ errors }, 422);

  try {
    if (await hit(`reset:ip:${clientIp(req)}`, 30, 900)) return tooMany();
    const user = await findUserByEmail(email);
    if (!user) return json({ errors: { code: "That code is incorrect or has expired." } }, 400);

    const { result, left } = await consumeCode(user.id, "reset", code);
    if (result === "wrong") return json({ errors: { code: `That code is incorrect. ${left} ${left === 1 ? "try" : "tries"} left.` } }, 400);
    if (result !== "ok") return json({ errors: { code: "That code has expired or was used too many times. Request a new one." } }, 400);

    await setPassword(user.id, await hashPassword(password));
    await markVerified(user.id); // receiving the code proves the email
    await endAllSessions(user.id); // sign out every other device
    await clear(`login:fail:${email}`);
    await startSession(user.id);
    return json({ ok: true });
  } catch (e) {
    return serverError("reset", e);
  }
}
