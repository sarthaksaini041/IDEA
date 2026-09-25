import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { MarketplaceId } from "./listings";

// Alert storage. Uses Postgres when DATABASE_URL is set (production); otherwise a local
// JSON file (development only; serverless hosts have no persistent disk).

export interface Alert {
  id: string;
  email: string;
  modelSlug: string;
  maxPrice: number;
  marketplace: MarketplaceId;
  token: string; // secret for confirm / unsubscribe links
  confirmed: boolean;
  createdAt: string;
  lastNotifiedAt: string | null;
}

export interface AlertStore {
  create(a: Omit<Alert, "id" | "token" | "confirmed" | "createdAt" | "lastNotifiedAt">): Promise<Alert>;
  countByEmail(email: string): Promise<number>;
  confirm(token: string): Promise<boolean>;
  removeByToken(token: string): Promise<boolean>;
  listConfirmed(): Promise<Alert[]>;
  markNotified(id: string, at: string): Promise<void>;
}

const newId = () => randomBytes(8).toString("hex");
const newToken = () => randomBytes(24).toString("base64url");

// ---------------------------------------------------------------- file store (dev)
class FileStore implements AlertStore {
  private file = path.join(process.cwd(), ".data", "alerts.json");
  private async read(): Promise<Alert[]> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8"));
    } catch {
      return [];
    }
  }
  private async write(all: Alert[]) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(all, null, 2));
  }
  async create(a: Parameters<AlertStore["create"]>[0]) {
    const all = await this.read();
    const alert: Alert = { ...a, id: newId(), token: newToken(), confirmed: false, createdAt: new Date().toISOString(), lastNotifiedAt: null };
    all.push(alert);
    await this.write(all);
    return alert;
  }
  async countByEmail(email: string) {
    return (await this.read()).filter((x) => x.email === email).length;
  }
  async confirm(token: string) {
    const all = await this.read();
    const a = all.find((x) => x.token === token);
    if (!a) return false;
    a.confirmed = true;
    await this.write(all);
    return true;
  }
  async removeByToken(token: string) {
    const all = await this.read();
    const next = all.filter((x) => x.token !== token);
    await this.write(next);
    return next.length !== all.length;
  }
  async listConfirmed() {
    return (await this.read()).filter((x) => x.confirmed);
  }
  async markNotified(id: string, at: string) {
    const all = await this.read();
    const a = all.find((x) => x.id === id);
    if (a) a.lastNotifiedAt = at;
    await this.write(all);
  }
}

// ---------------------------------------------------------------- Postgres store (prod)
class PgStore implements AlertStore {
  private pool: import("pg").Pool | null = null;
  private ready: Promise<void> | null = null;
  private async db() {
    if (!this.pool) {
      const { Pool } = await import("pg");
      this.pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
      this.ready = this.pool
        .query(
          `create table if not exists alerts (
            id text primary key, email text not null, model_slug text not null,
            max_price numeric not null, marketplace text not null, token text unique not null,
            confirmed boolean not null default false, created_at timestamptz not null default now(),
            last_notified_at timestamptz)`,
        )
        .then(() => undefined);
    }
    await this.ready;
    return this.pool;
  }
  private row(r: Record<string, unknown>): Alert {
    return {
      id: r.id as string, email: r.email as string, modelSlug: r.model_slug as string,
      maxPrice: Number(r.max_price), marketplace: r.marketplace as MarketplaceId, token: r.token as string,
      confirmed: Boolean(r.confirmed), createdAt: new Date(r.created_at as string).toISOString(),
      lastNotifiedAt: r.last_notified_at ? new Date(r.last_notified_at as string).toISOString() : null,
    };
  }
  async create(a: Parameters<AlertStore["create"]>[0]) {
    const db = await this.db();
    const res = await db.query(
      `insert into alerts (id,email,model_slug,max_price,marketplace,token) values ($1,$2,$3,$4,$5,$6) returning *`,
      [newId(), a.email, a.modelSlug, a.maxPrice, a.marketplace, newToken()],
    );
    return this.row(res.rows[0]);
  }
  async countByEmail(email: string) {
    const r = await (await this.db()).query(`select count(*)::int as n from alerts where email=$1`, [email]);
    return r.rows[0].n as number;
  }
  async confirm(token: string) {
    const r = await (await this.db()).query(`update alerts set confirmed=true where token=$1`, [token]);
    return (r.rowCount ?? 0) > 0;
  }
  async removeByToken(token: string) {
    const r = await (await this.db()).query(`delete from alerts where token=$1`, [token]);
    return (r.rowCount ?? 0) > 0;
  }
  async listConfirmed() {
    const r = await (await this.db()).query(`select * from alerts where confirmed`);
    return r.rows.map((x) => this.row(x));
  }
  async markNotified(id: string, at: string) {
    await (await this.db()).query(`update alerts set last_notified_at=$2 where id=$1`, [id, at]);
  }
}

let store: AlertStore | null = null;
export function getStore(): AlertStore {
  if (!store) store = process.env.DATABASE_URL ? new PgStore() : new FileStore();
  return store;
}
