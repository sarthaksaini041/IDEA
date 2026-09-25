import { query } from "../db";

// Sliding-window limits backed by Postgres, so they hold across serverless instances.

/** Returns true when `key` has already reached `max` events in the last `windowSec`. */
export async function isLimited(key: string, max: number, windowSec: number): Promise<boolean> {
  const r = await query<{ n: number }>(
    `select count(*)::int as n from auth_attempts where key = $1 and created_at > now() - make_interval(secs => $2)`,
    [key, windowSec],
  );
  return r.rows[0].n >= max;
}

export async function record(key: string): Promise<void> {
  await query(`insert into auth_attempts (key) values ($1)`, [key]);
  // Opportunistic cleanup keeps the table tiny without a separate job.
  if (Math.random() < 0.02) await query(`delete from auth_attempts where created_at < now() - interval '1 day'`);
}

/** Record the event, then report whether it pushed `key` over the limit. */
export async function hit(key: string, max: number, windowSec: number): Promise<boolean> {
  await record(key);
  return isLimited(key, max + 1, windowSec);
}

export async function clear(key: string): Promise<void> {
  await query(`delete from auth_attempts where key = $1`, [key]);
}

export function clientIp(req: Request): string {
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}
