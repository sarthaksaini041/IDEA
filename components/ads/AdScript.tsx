import Script from "next/script";
import { AD_PROVIDER, ADSENSE_CLIENT, adsEnabled } from "./AdConfig";

/** Loads the provider script once, only when ads are enabled. */
export function AdScript() {
  if (!adsEnabled() || AD_PROVIDER !== "adsense") return null;
  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
