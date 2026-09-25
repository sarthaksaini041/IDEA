// Transactional email via Resend's HTTP API (no SDK needed). If RESEND_API_KEY is not
// set, emails are logged instead so the flow can be tested locally.
export interface Email {
  to: string;
  subject: string;
  text: string;
  html?: string;
  headers?: Record<string, string>;
}

export async function sendEmail({ to, subject, text, html, headers }: Email): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.info(`[email:dev] to=${to} subject=${subject}\n${text}`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, html, headers, reply_to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined }),
  });
  if (!res.ok) console.error(`[email] send failed: ${res.status}`);
  return res.ok;
}

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
