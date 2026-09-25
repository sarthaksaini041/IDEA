// Input validation shared by the API routes and the forms.
export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;

export type Errors = Record<string, string>;

export const normEmail = (v: unknown) => String(v ?? "").trim().toLowerCase();

export function checkEmail(email: string, errors: Errors) {
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
}

export function checkPassword(password: string, email: string, errors: Errors, field = "password") {
  if (password.length < 8) errors[field] = "Use at least 8 characters.";
  else if (password.length > 128) errors[field] = "Use at most 128 characters.";
  else if (email && password.toLowerCase() === email) errors[field] = "Don't use your email as your password.";
  else if (/^(.)\1+$/.test(password) || ["password", "12345678", "123456789", "qwertyui"].includes(password.toLowerCase()))
    errors[field] = "That password is too easy to guess.";
}

export function checkName(name: string, errors: Errors) {
  if (name.length < 1) errors.name = "Enter your name.";
  else if (name.length > 80) errors.name = "Keep it under 80 characters.";
}

export const CODE_RE = /^\d{6}$/;

/** Only allow same-site relative redirects after login ("/x", never "//evil.com" or "https://..."). */
export function safeNext(next: unknown, fallback = "/account"): string {
  const s = String(next ?? "");
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") && s.length < 300 ? s : fallback;
}
