// Scrubs URLs before they are sent to analytics / performance monitoring.
// Personal or secret values (emails, one-time codes, unsubscribe tokens, redirect targets)
// must never leave the browser; harmless finder filters are kept so feature usage is visible.

const SECRET_PARAMS = new Set(["email", "code", "token", "next", "password", "_vercel_share"]);
const PRIVATE_PATHS = ["/verify", "/login", "/signup", "/forgot", "/account", "/alerts/unsubscribe"];

export function redactUrl(raw: string): string {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return raw.split("?")[0].split("#")[0];
  }
  u.hash = "";
  if (PRIVATE_PATHS.some((p) => u.pathname === p || u.pathname.startsWith(`${p}/`))) {
    u.search = ""; // nothing on these pages is worth keeping
    return u.toString();
  }
  for (const key of [...u.searchParams.keys()]) {
    if (SECRET_PARAMS.has(key.toLowerCase()) || /@/.test(u.searchParams.get(key) ?? "")) u.searchParams.delete(key);
  }
  return u.toString();
}
