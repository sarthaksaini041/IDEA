// Tiny JSON POST helper for the auth forms. Never throws: network failures come back as a form error.
export interface ApiResult {
  status: number;
  data: { ok?: boolean; error?: string; errors?: Record<string, string>; [k: string]: unknown };
}

export async function postJson(url: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } catch {
    return { status: 0, data: { error: "Can't reach the server. Check your connection and try again." } };
  }
}

/** Collapse an API response into field errors plus one form-level message. */
export function errorsFrom(r: ApiResult): Record<string, string> {
  const errs = { ...(r.data.errors ?? {}) };
  if (r.data.error && !errs.form) errs.form = r.data.error;
  if (!r.data.ok && !Object.keys(errs).length && r.status >= 400) errs.form = "Something went wrong. Please try again.";
  return errs;
}
