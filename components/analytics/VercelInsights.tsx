"use client";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redactUrl } from "../../lib/redact";

/**
 * Vercel Web Analytics (visits, referrers, top pages) and Speed Insights (real-user
 * Core Web Vitals). Both are cookieless. Every event's URL is scrubbed first.
 */
export function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={(e) => ({ ...e, url: redactUrl(e.url) })} />
      <SpeedInsights beforeSend={(e) => ({ ...e, url: redactUrl(e.url) })} />
    </>
  );
}
