"use client";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "../../lib/consent";
import { redactUrl } from "../../lib/redact";

/**
 * Vercel Web Analytics (visits, referrers, top pages) and Speed Insights (real-user
 * Core Web Vitals). Both are cookieless. Every event's URL is scrubbed first, and
 * nothing loads if the visitor switched analytics off in cookie settings.
 */
export function VercelInsights() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(readConsent()?.analytics ?? true);
    const onChange = (e: Event) => setOn((e as CustomEvent<Consent>).detail.analytics);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);
  if (!on) return null;
  return (
    <>
      <Analytics beforeSend={(e) => (readConsent()?.analytics === false ? null : { ...e, url: redactUrl(e.url) })} />
      <SpeedInsights beforeSend={(e) => (readConsent()?.analytics === false ? null : { ...e, url: redactUrl(e.url) })} />
    </>
  );
}
