import { randomBytes } from "node:crypto";
import { query } from "./db";
import type { MarketplaceId } from "./listings";

// Price alerts, owned by verified user accounts.

export interface Alert {
  id: string;
  email: string;
  modelSlug: string;
  maxPrice: number;
  marketplace: MarketplaceId;
  token: string; // secret for the one-click unsubscribe link in alert emails
  createdAt: string;
  lastNotifiedAt: string | null;
}

interface Row {
  id: string; email: string; model_slug: string; max_price: string; marketplace: MarketplaceId;
  token: string; created_at: Date; last_notified_at: Date | null;
}
const toAlert = (r: Row): Alert => ({
  id: r.id, email: r.email, modelSlug: r.model_slug, maxPrice: Number(r.max_price), marketplace: r.marketplace,
  token: r.token, createdAt: new Date(r.created_at).toISOString(),
  lastNotifiedAt: r.last_notified_at ? new Date(r.last_notified_at).toISOString() : null,
});
const COLS = "id, email, model_slug, max_price, marketplace, token, created_at, last_notified_at";

export const MAX_ALERTS_PER_USER = 10;

export async function createAlert(user: { id: string; email: string }, a: { modelSlug: string; maxPrice: number; marketplace: MarketplaceId }): Promise<Alert> {
  const r = await query<Row>(
    `insert into alerts (id, user_id, email, model_slug, max_price, marketplace, token, confirmed)
     values ($1, $2, $3, $4, $5, $6, $7, true) returning ${COLS}`,
    [randomBytes(8).toString("hex"), user.id, user.email, a.modelSlug, a.maxPrice, a.marketplace, randomBytes(24).toString("base64url")],
  );
  return toAlert(r.rows[0]);
}

export async function countForUser(userId: string): Promise<number> {
  const r = await query<{ n: number }>(`select count(*)::int as n from alerts where user_id = $1`, [userId]);
  return r.rows[0].n;
}

export async function listForUser(userId: string): Promise<Alert[]> {
  const r = await query<Row>(`select ${COLS} from alerts where user_id = $1 order by created_at desc`, [userId]);
  return r.rows.map(toAlert);
}

/** Delete only if the alert belongs to this user. */
export async function deleteForUser(userId: string, id: string): Promise<boolean> {
  const r = await query(`delete from alerts where id = $1 and user_id = $2`, [id, userId]);
  return (r.rowCount ?? 0) > 0;
}

export async function removeByToken(token: string): Promise<boolean> {
  const r = await query(`delete from alerts where token = $1`, [token]);
  return (r.rowCount ?? 0) > 0;
}

/** Alerts the price checker should run: owned by a verified account. */
export async function listActive(): Promise<Alert[]> {
  const r = await query<Row>(
    `select a.id, u.email, a.model_slug, a.max_price, a.marketplace, a.token, a.created_at, a.last_notified_at
       from alerts a join users u on u.id = a.user_id where u.email_verified_at is not null`,
  );
  return r.rows.map(toAlert);
}

export async function markNotified(id: string, at: string): Promise<void> {
  await query(`update alerts set last_notified_at = $2 where id = $1`, [id, at]);
}
