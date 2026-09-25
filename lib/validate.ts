import { MODELS } from "../data/models";
import { MARKETPLACES, type MarketplaceId } from "./listings";

export interface AlertInput { modelSlug: string; maxPrice: number; marketplace: MarketplaceId }
export type Result<T> = { ok: true; value: T } | { ok: false; errors: Record<string, string> };

export function validateAlert(body: unknown): Result<AlertInput> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const modelSlug = String(b.modelSlug ?? "");
  const marketplace = String(b.marketplace ?? "EBAY_US") as MarketplaceId;
  const maxPrice = Number(b.maxPrice);

  if (!MODELS.some((m) => m.slug === modelSlug)) errors.modelSlug = "Choose a model from the list.";
  if (!Object.hasOwn(MARKETPLACES, marketplace)) errors.marketplace = "Choose a marketplace.";
  if (!Number.isFinite(maxPrice) || maxPrice < 20 || maxPrice > 5000) errors.maxPrice = "Enter a price between 20 and 5000.";

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value: { modelSlug, maxPrice: Math.round(maxPrice), marketplace } };
}
