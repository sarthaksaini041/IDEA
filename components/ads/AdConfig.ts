// Advertising configuration. Ads are OFF unless NEXT_PUBLIC_ADS_PROVIDER is set.
//
//   NEXT_PUBLIC_ADS_PROVIDER=none         -> no ad markup at all (default)
//   NEXT_PUBLIC_ADS_PROVIDER=placeholder  -> labelled grey boxes, for layout testing only
//   NEXT_PUBLIC_ADS_PROVIDER=adsense      -> Google AdSense (requires client + slot ids)
//
// Adding another provider = add a value to AdProvider and a renderer in AdSlot.tsx.

export type AdProvider = "none" | "placeholder" | "adsense";
export type Placement = "in-content" | "sidebar" | "below-results" | "footer";

export interface PlacementConfig {
  /** Height reserved before the ad loads, so the page does not jump (CLS). */
  minHeight: { mobile: number; desktop: number };
  /** Hide on small screens (e.g. sidebar has no room on mobile). */
  desktopOnly?: boolean;
  adsenseSlot?: string;
  format: "auto" | "rectangle" | "horizontal" | "vertical";
}

const env = (k: string) => (process.env[k] || "").trim();

export const AD_PROVIDER: AdProvider = (["none", "placeholder", "adsense"] as const).includes(
  env("NEXT_PUBLIC_ADS_PROVIDER") as AdProvider,
)
  ? (env("NEXT_PUBLIC_ADS_PROVIDER") as AdProvider)
  : "none";

export const ADSENSE_CLIENT = env("NEXT_PUBLIC_ADSENSE_CLIENT"); // "ca-pub-XXXXXXXXXXXXXXXX"

// NEXT_PUBLIC_* values must be referenced literally so Next.js inlines them in client code.
export const PLACEMENTS: Record<Placement, PlacementConfig> = {
  "in-content": { minHeight: { mobile: 280, desktop: 250 }, format: "auto", adsenseSlot: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT },
  sidebar: { minHeight: { mobile: 0, desktop: 600 }, desktopOnly: true, format: "vertical", adsenseSlot: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR },
  "below-results": { minHeight: { mobile: 280, desktop: 120 }, format: "horizontal", adsenseSlot: process.env.NEXT_PUBLIC_AD_SLOT_BELOW_RESULTS },
  footer: { minHeight: { mobile: 280, desktop: 120 }, format: "horizontal", adsenseSlot: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER },
};

export function adsEnabled(): boolean {
  if (AD_PROVIDER === "adsense") return /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);
  return AD_PROVIDER === "placeholder";
}
