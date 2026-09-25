import type { Model } from "../data/models";

// Outbound marketplace links. When an eBay Partner Network campaign id is configured the
// links carry affiliate parameters and are marked rel="sponsored"; the site discloses this.
export const MARKETPLACES = {
  EBAY_US: { label: "eBay US", host: "www.ebay.com", currency: "USD", mkrid: "711-53200-19255-0" },
  EBAY_GB: { label: "eBay UK", host: "www.ebay.co.uk", currency: "GBP", mkrid: "710-53481-19255-0" },
  EBAY_DE: { label: "eBay DE", host: "www.ebay.de", currency: "EUR", mkrid: "707-53477-19255-0" },
} as const;
export type MarketplaceId = keyof typeof MARKETPLACES;

export function searchQuery(model: Model): string {
  return model.name.replace(/^(Lenovo|Dell|HP) /, "$1 ").replace(" Tiny", "");
}

export function ebaySearchUrl(model: Model, market: MarketplaceId = "EBAY_US"): string {
  const mk = MARKETPLACES[market];
  const params = new URLSearchParams({ _nkw: searchQuery(model), _sacat: "0" });
  const campaign = process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID;
  if (campaign) {
    params.set("mkcid", "1");
    params.set("mkrid", mk.mkrid);
    params.set("campid", campaign);
    params.set("toolid", "10001");
    params.set("customid", model.slug);
  }
  return `https://${mk.host}/sch/i.html?${params.toString()}`;
}

export const isAffiliate = () => Boolean(process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID);
