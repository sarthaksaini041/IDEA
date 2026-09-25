import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { clientIp, hit } from "../../../../lib/auth/rate";
import { startSession } from "../../../../lib/auth/session";
import { consumeCode, findUserByEmail, markVerified } from "../../../../lib/auth/users";
import { CODE_RE, normEmail } from "../../../../lib/auth/validate";

export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);
  const email = normEmail(b.email);
  const code = String(b.code ?? "").replace(/\s/g, "");
  if (!CODE_RE.test(code)) return json({ errors: { code: "Enter the 6-digit code from the email." } }, 422);

  try {
    if (await hit(`verify:ip:${clientIp(req)}`, 30, 900)) return tooMany();
    const user = await findUserByEmail(email);
    if (!user) return json({ errors: { code: "That code is incorrect or has expired." } }, 400);
    if (user.email_verified_at) return json({ error: "This email is already verified. Please log in." }, 409);

    const { result, left } = await consumeCode(user.id, "verify", code);
    if (result === "wrong") return json({ errors: { code: `That code is incorrect. ${left} ${left === 1 ? "try" : "tries"} left.` } }, 400);
    if (result === "locked") return json({ errors: { code: "Too many wrong tries. Request a new code." } }, 400);
    if (result === "expired") return json({ errors: { code: "That code has expired. Request a new one." } }, 400);

    await markVerified(user.id);
    await startSession(user.id);
    return json({ ok: true });
  } catch (e) {
    return serverError("verify", e);
  }
}
