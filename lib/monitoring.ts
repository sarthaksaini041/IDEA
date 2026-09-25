// Provider-agnostic error reporting. Always logs a structured line (visible in Vercel
// runtime logs). If ERROR_WEBHOOK_URL is set, also POSTs a small JSON payload to it, which
// works with Slack/Discord incoming webhooks or any collector. A full SDK (Sentry etc.)
// can replace `send` later without touching call sites.
export interface ErrorContext { where: string; [k: string]: string | number | boolean | undefined }

export function reportError(err: unknown, ctx: ErrorContext): void {
  const e = err instanceof Error ? err : new Error(String(err));
  const payload = { level: "error", where: ctx.where, message: e.message, ctx, at: new Date().toISOString() };
  console.error(`[error] ${ctx.where}: ${e.message}`, JSON.stringify(payload));
  void send(payload);
}

async function send(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `[${payload.where}] ${payload.message}`, ...payload }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // never let reporting break the request
  }
}
