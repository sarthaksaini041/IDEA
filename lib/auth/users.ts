import { query } from "../db";
import { codeMatches, hashCode, newCode } from "./crypto";

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  email_verified_at: string | null;
}
export type Purpose = "verify" | "reset";

export const CODE_TTL_MIN = 10;
export const CODE_MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SEC = 60;

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const r = await query<UserRow>(`select id, email, name, password_hash, email_verified_at from users where email = $1`, [email]);
  return r.rows[0] ?? null;
}

export async function createUser(email: string, name: string, passwordHash: string): Promise<UserRow> {
  const r = await query<UserRow>(
    `insert into users (email, name, password_hash) values ($1, $2, $3)
     returning id, email, name, password_hash, email_verified_at`,
    [email, name, passwordHash],
  );
  return r.rows[0];
}

/** An unverified account can be re-registered: nobody has proven ownership of that email yet. */
export async function resetUnverifiedUser(id: string, name: string, passwordHash: string): Promise<void> {
  await query(`update users set name = $2, password_hash = $3 where id = $1 and email_verified_at is null`, [id, name, passwordHash]);
}

export async function markVerified(id: string): Promise<void> {
  await query(`update users set email_verified_at = coalesce(email_verified_at, now()) where id = $1`, [id]);
}

export async function setPassword(id: string, passwordHash: string): Promise<void> {
  await query(`update users set password_hash = $2 where id = $1`, [id, passwordHash]);
}

/** Seconds until another code may be sent (0 = allowed now). */
export async function cooldownRemaining(userId: string, purpose: Purpose): Promise<number> {
  const r = await query<{ wait: number }>(
    `select greatest(0, ceil(extract(epoch from (created_at + make_interval(secs => $3) - now()))))::int as wait
       from email_codes where user_id = $1 and purpose = $2 order by created_at desc limit 1`,
    [userId, purpose, RESEND_COOLDOWN_SEC],
  );
  return r.rows[0]?.wait ?? 0;
}

/** Issue a fresh code, invalidating any earlier unused code for the same purpose. */
export async function issueCode(userId: string, purpose: Purpose): Promise<string> {
  const code = newCode();
  await query(`update email_codes set consumed_at = now() where user_id = $1 and purpose = $2 and consumed_at is null`, [userId, purpose]);
  await query(
    `insert into email_codes (user_id, purpose, code_hash, expires_at) values ($1, $2, $3, now() + make_interval(mins => $4))`,
    [userId, purpose, hashCode(userId, purpose, code), CODE_TTL_MIN],
  );
  return code;
}

export type CodeCheck = "ok" | "wrong" | "expired" | "locked";

/**
 * Check a submitted code. Wrong guesses are counted atomically, and a code is locked
 * after CODE_MAX_ATTEMPTS so six digits cannot be brute-forced.
 */
export async function consumeCode(userId: string, purpose: Purpose, code: string): Promise<{ result: CodeCheck; left: number }> {
  const r = await query<{ id: string; code_hash: string; attempts: number; expired: boolean }>(
    `select id, code_hash, attempts, expires_at < now() as expired from email_codes
      where user_id = $1 and purpose = $2 and consumed_at is null order by created_at desc limit 1`,
    [userId, purpose],
  );
  const row = r.rows[0];
  if (!row || row.expired) return { result: "expired", left: 0 };
  if (row.attempts >= CODE_MAX_ATTEMPTS) return { result: "locked", left: 0 };
  if (!codeMatches(userId, purpose, code, row.code_hash)) {
    const u = await query<{ attempts: number }>(`update email_codes set attempts = attempts + 1 where id = $1 returning attempts`, [row.id]);
    const left = Math.max(0, CODE_MAX_ATTEMPTS - u.rows[0].attempts);
    return { result: left === 0 ? "locked" : "wrong", left };
  }
  // Guard against a double submit racing: only one request can consume the code.
  const c = await query(`update email_codes set consumed_at = now() where id = $1 and consumed_at is null`, [row.id]);
  return (c.rowCount ?? 0) === 1 ? { result: "ok", left: 0 } : { result: "expired", left: 0 };
}
