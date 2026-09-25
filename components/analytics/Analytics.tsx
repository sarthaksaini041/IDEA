import Script from "next/script";

// Privacy-friendly, cookieless analytics. Pick one provider via env:
//   NEXT_PUBLIC_ANALYTICS=plausible  + NEXT_PUBLIC_PLAUSIBLE_DOMAIN (+ optional NEXT_PUBLIC_PLAUSIBLE_SRC)
//   NEXT_PUBLIC_ANALYTICS=umami      + NEXT_PUBLIC_UMAMI_WEBSITE_ID + NEXT_PUBLIC_UMAMI_SRC
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS;
  if (provider === "plausible" && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.outbound-links.js"}
      />
    );
  }
  if (provider === "umami" && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_SRC) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        src={process.env.NEXT_PUBLIC_UMAMI_SRC}
      />
    );
  }
  return null;
}
