import { MARKETPLACES, type MarketplaceId } from "./listings";

// eBay Browse API (active fixed-price listings). Sold-price history needs eBay's
// Marketplace Insights API, which requires separate approval, so alerts are based on
// current asking prices.

let cached: { token: string; expires: number } | null = null;

async function appToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const id = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("EBAY_CLIENT_ID / EBAY_CLIENT_SECRET not configured");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "https://api.ebay.com/oauth/api_scope" }),
  });
  if (!res.ok) throw new Error(`eBay token request failed: ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, expires: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

export interface Listing { title: string; price: number; currency: string; url: string }

export async function findListingsUnder(query: string, maxPrice: number, market: MarketplaceId): Promise<Listing[]> {
  const token = await appToken();
  const { currency } = MARKETPLACES[market];
  const params = new URLSearchParams({
    q: query,
    limit: "20",
    sort: "price",
    filter: `price:[..${maxPrice}],priceCurrency:${currency},buyingOptions:{FIXED_PRICE}`,
  });
  const res = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": market },
  });
  if (!res.ok) throw new Error(`eBay search failed: ${res.status}`);
  const j = (await res.json()) as { itemSummaries?: Array<{ title: string; price?: { value: string; currency: string }; itemWebUrl: string }> };
  return (j.itemSummaries || [])
    .filter((i) => i.price)
    // Drop obvious parts listings (caddies, adapters, empty chassis) that match model names.
    .filter((i) => !/\b(caddy|bracket|adapter|charger|power supply|psu|parts only|for parts|no (cpu|ram|ssd))\b/i.test(i.title))
    .map((i) => ({ title: i.title, price: Number(i.price!.value), currency: i.price!.currency, url: i.itemWebUrl }));
}

export const ebayConfigured = () => Boolean(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
