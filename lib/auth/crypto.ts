import { createHash, createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";

// ---------------------------------------------------------------- passwords (scrypt)
// N=2^14, r=8, p=1: ~50 ms and 16 MB per hash on a serverless CPU. Parameters are stored
// with each hash so they can be raised later without breaking existing accounts.
const N = 16384, R = 8, P = 1, KEYLEN = 32;

function scryptAsync(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), Number(n), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// A real hash of a random password, used when an email is unknown so a login attempt
// takes the same time whether or not the account exists.
let dummy: Promise<string> | null = null;
export const dummyHash = () => (dummy ??= hashPassword(randomBytes(16).toString("hex")));

// ---------------------------------------------------------------- one-time codes
function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-insecure-auth-secret-change-me-please";
  throw new Error("AUTH_SECRET must be set (32+ characters) in production");
}

export const newCode = () => randomInt(0, 1_000_000).toString().padStart(6, "0");

/** Codes are stored as keyed hashes bound to the user and purpose, never in plain text. */
export const hashCode = (userId: string, purpose: string, code: string) =>
  createHmac("sha256", secret()).update(`${userId}:${purpose}:${code}`).digest("base64url");

export function codeMatches(userId: string, purpose: string, code: string, storedHash: string): boolean {
  const a = Buffer.from(hashCode(userId, purpose, code));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------- session tokens
export const newSessionToken = () => randomBytes(32).toString("base64url");
/** Only the SHA-256 of a session token is stored, so a database leak cannot be replayed as logins. */
export const hashToken = (token: string) => createHash("sha256").update(token).digest("base64url");
