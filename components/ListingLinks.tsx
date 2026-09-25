"use client";
import type { Model } from "../data/models";
import { MARKETPLACES, ebaySearchUrl, type MarketplaceId } from "../lib/listings";
import { track } from "./analytics/track";

export function ListingLinks({ model }: { model: Model }) {
  const affiliate = Boolean(process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID);
  return (
    <div>
      <div className="btn-row">
        {(Object.keys(MARKETPLACES) as MarketplaceId[]).map((id) => (
          <a
            key={id}
            className="btn"
            href={ebaySearchUrl(model, id)}
            target="_blank"
            rel={affiliate ? "sponsored nofollow noopener" : "nofollow noopener"}
            onClick={() => track("listing_click", { model: model.slug, market: id })}
          >
            Search {MARKETPLACES[id].label} ↗
          </a>
        ))}
      </div>
      {affiliate && <p className="small muted">These are affiliate links. We may earn a commission; it does not change the price you pay.</p>}
    </div>
  );
}
