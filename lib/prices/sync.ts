import { MODELS } from "../../data/models";
import { searchQuery } from "../listings";
import { reportError } from "../monitoring";
import { priceMarkets, priceStatus } from "./config";
import { ebayProvider } from "./ebay";
import { saveSnapshot } from "./store";
import type { PriceProvider } from "./types";

export interface SyncResult { status: ReturnType<typeof priceStatus>; saved: number; empty: number; failed: number }

/** One pass over every model and configured marketplace. Sequential: ~25–75 API calls/day. */
export async function syncPrices(provider: PriceProvider = ebayProvider): Promise<SyncResult> {
  const status = priceStatus();
  const result: SyncResult = { status, saved: 0, empty: 0, failed: 0 };
  if (status !== "ACTIVE" || !provider.configured()) return result;
  for (const model of MODELS) {
    for (const market of priceMarkets()) {
      try {
        const snap = await provider.snapshot(model.slug, searchQuery(model), market);
        if (!snap) { result.empty++; continue; }
        await saveSnapshot(snap);
        result.saved++;
      } catch (e) {
        result.failed++;
        reportError(e, { where: "price-sync", model: model.slug, market });
      }
    }
  }
  return result;
}
