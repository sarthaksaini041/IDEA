import { sendEmail } from "../email";
import { SITE } from "../site";
import { CODE_TTL_MIN, type Purpose } from "./users";

/** Send a one-time code. Returns false if the email provider rejected it. */
export async function sendCode(to: string, name: string, code: string, purpose: Purpose): Promise<boolean> {
  const what = purpose === "verify" ? "confirm your email" : "reset your password";
  const subject = purpose === "verify" ? `${code} is your ${SITE.name} verification code` : `${code} is your ${SITE.name} password reset code`;
  const text = [
    `Hi ${name},`,
    ``,
    `Use this code to ${what}:`,
    ``,
    `    ${code}`,
    ``,
    `It expires in ${CODE_TTL_MIN} minutes. If you didn't ask for this, you can ignore this email.`,
    ``,
    `— ${SITE.name}`,
  ].join("\n");
  return sendEmail(to, subject, text);
}
