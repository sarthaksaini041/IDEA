import { cookies } from "next/headers";
import { query } from "../db";
import { SITE } from "../site";
import { hashToken, newSessionToken } from "./crypto";

export const SESSION_COOKIE = "tlf_session";
const SESSION_DAYS = 30;

export interface SessionUser { id: string; email: string; name: string }

const cookieOptions = (maxAge: number) => ({
  httpOnly: true, // not readable by page scripts
  secure: SITE.url.startsWith("https://"),
  sameSite: "lax" as const, // not sent on cross-site POSTs
  path: "/",
  maxAge,
});

export async function startSession(userId: string): Promise<void> {
  const token = newSessionToken();
  await query(
    `insert into sessions (token_hash, user_id, expires_at) values ($1, $2, now() + make_interval(days => $3))`,
    [hashToken(token), userId, SESSION_DAYS],
  );
  if (Math.random() < 0.05) await query(`delete from sessions where expires_at < now()`);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_DAYS * 86400));
}

/** The logged-in, verified user for this request, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  try {
    const r = await query<SessionUser>(
      `select u.id, u.email, u.name from sessions s join users u on u.id = s.user_id
        where s.token_hash = $1 and s.expires_at > now() and u.email_verified_at is not null`,
      [hashToken(token)],
    );
    return r.rows[0] ?? null;
  } catch (e) {
    console.error("[auth] session lookup failed", e);
    return null;
  }
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await query(`delete from sessions where token_hash = $1`, [hashToken(token)]);
  jar.set(SESSION_COOKIE, "", cookieOptions(0));
}

/** Sign every device out, e.g. after a password reset. */
export async function endAllSessions(userId: string): Promise<void> {
  await query(`delete from sessions where user_id = $1`, [userId]);
}
