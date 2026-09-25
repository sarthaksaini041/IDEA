import type { Pool, QueryResultRow } from "pg";
import { SCHEMA_SQL } from "./schema";

// One pool per server instance. Serverless functions are short-lived, so keep it small
// and point DATABASE_URL at a transaction pooler (Supabase: port 6543).
let pool: Pool | null = null;
let ready: Promise<void> | null = null;

async function getPool(): Promise<Pool> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!pool) {
    const { Pool } = await import("pg");
    // Hosted Postgres (Supabase) signs server certs with its own CA; pass it via
    // DATABASE_CA_CERT so TLS stays fully verified.
    const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      ...(ca ? { ssl: { ca, rejectUnauthorized: true } } : {}),
    });
    // The schema is idempotent; running it once per instance keeps fresh databases
    // (local dev, preview branches) working without a separate migration step.
    ready = pool.query(SCHEMA_SQL).then(() => undefined);
    ready.catch(() => {
      // Let the next request retry schema setup instead of caching a failure forever.
      ready = null;
      pool?.end().catch(() => {});
      pool = null;
    });
  }
  await ready;
  return pool!;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const p = await getPool();
  return p.query<T>(text, params);
}

export const dbConfigured = () => Boolean(process.env.DATABASE_URL);
