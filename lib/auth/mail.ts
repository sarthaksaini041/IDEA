import { sendEmail } from "../email";
import { codeEmail } from "../emailTemplates";
import { CODE_TTL_MIN, type Purpose } from "./users";

/** Send a one-time code. Returns false if the email provider rejected it. */
export async function sendCode(to: string, name: string, code: string, purpose: Purpose): Promise<boolean> {
  return sendEmail({ to, ...codeEmail({ name, code, purpose, ttlMin: CODE_TTL_MIN }) });
}
