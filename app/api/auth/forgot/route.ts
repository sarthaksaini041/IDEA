import { json, readJson, rejectCrossSite, serverError, tooMany } from "../../../../lib/auth/http";
import { sendCode } from "../../../../lib/auth/mail";
import { clientIp, hit } from "../../../../lib/auth/rate";
import { cooldownRemaining, findUserByEmail, issueCode } from "../../../../lib/auth/users";
import { checkEmail, normEmail, type Errors } from "../../../../lib/auth/validate";

// Same response whether or not the email has an account.
export async function POST(req: Request) {
  const bad = rejectCrossSite(req);
  if (bad) return bad;
  const b = await readJson(req);
  if (!b) return json({ error: "Invalid request." }, 400);
  const email = normEmail(b.email);
  const errors: Errors = {};
  checkEmail(email, errors);
  if (Object.keys(errors).length) return json({ errors }, 422);

  try {
    if (await hit(`forgot:ip:${clientIp(req)}`, 10, 3600)) return tooMany();
    const user = await findUserByEmail(email);
    if (user && (await cooldownRemaining(user.id, "reset")) === 0 && !(await hit(`code:${email}`, 6, 3600))) {
      const code = await issueCode(user.id, "reset");
      await sendCode(email, user.name, code, "reset");
    }
    return json({ ok: true });
  } catch (e) {
    return serverError("forgot", e);
  }
}
