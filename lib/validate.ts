import { MODELS } from "../data/models";
import { MARKETPLACES, type MarketplaceId } from "./listings";

export interface AlertInput { email: string; modelSlug: string; maxPrice: number; marketplace: MarketplaceId }
export type Result<T> = { ok: true; value: T } | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;

export function validateAlert(body: unknown): Result<AlertInput> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const email = String(b.email ?? "").trim().toLowerCase();
  const modelSlug = String(b.modelSlug ?? "");
  const marketplace = String(b.marketplace ?? "EBAY_US") as MarketplaceId;
  const maxPrice = Number(b.maxPrice);

  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (!MODELS.some((m) => m.slug === modelSlug)) errors.modelSlug = "Choose a model from the list.";
  if (!(marketplace in MARKETPLACES)) errors.marketplace = "Choose a marketplace.";
  if (!Number.isFinite(maxPrice) || maxPrice < 20 || maxPrice > 5000) errors.maxPrice = "Enter a price between 20 and 5000.";
  // Honeypot: real users never fill the hidden "website" field.
  if (b.website) errors.form = "Submission rejected.";

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value: { email, modelSlug, maxPrice: Math.round(maxPrice), marketplace } };
}
