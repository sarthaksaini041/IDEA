import { query } from "./db";

export const MAX_SAVED = 50;

export async function listSaved(userId: string): Promise<string[]> {
  const r = await query<{ model_slug: string }>(`select model_slug from saved_models where user_id = $1 order by created_at desc`, [userId]);
  return r.rows.map((x) => x.model_slug);
}

export async function countSaved(userId: string): Promise<number> {
  const r = await query<{ n: number }>(`select count(*)::int as n from saved_models where user_id = $1`, [userId]);
  return r.rows[0].n;
}

export async function saveModel(userId: string, slug: string): Promise<void> {
  await query(`insert into saved_models (user_id, model_slug) values ($1, $2) on conflict do nothing`, [userId, slug]);
}

export async function unsaveModel(userId: string, slug: string): Promise<void> {
  await query(`delete from saved_models where user_id = $1 and model_slug = $2`, [userId, slug]);
}
