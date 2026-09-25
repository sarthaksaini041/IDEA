import { MARKETPLACES, type MarketplaceId } from "../listings";
import type { PriceStatus } from "./types";

export function ebayCredentialsPresent(): boolean {
  return Boolean(process.env.EBAY_CLIENT_ID?.trim() && process.env.EBAY_CLIENT_SECRET?.trim());
}

export function priceStatus(): PriceStatus {
  if (process.env.PRICE_SYNC_ENABLED === "false") return "DISABLED";
  return ebayCredentialsPresent() ? "ACTIVE" : "PENDING_CREDENTIALS";
}

/** Marketplaces to sync, from PRICE_MARKETS (comma-separated), default EBAY_US. Unknown ids are ignored. */
export function priceMarkets(): MarketplaceId[] {
  const raw = (process.env.PRICE_MARKETS || "EBAY_US").split(",").map((s) => s.trim());
  const ok = raw.filter((m): m is MarketplaceId => m in MARKETPLACES);
  return ok.length ? ok : ["EBAY_US"];
}

/** Prices older than this are shown as stale and not used for "currently from". */
export const PRICE_FRESH_HOURS = 48;
