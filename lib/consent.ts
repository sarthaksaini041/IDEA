// Visitor's cookie/analytics choice, kept in their own browser only.
export const CONSENT_KEY = "tlf-consent";
export const CONSENT_EVENT = "tlf-consent-change";
export const OPEN_SETTINGS_EVENT = "tlf-open-cookie-settings";
const VERSION = 1;

export interface Consent { v: number; analytics: boolean; at: string }

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null") as Consent | null;
    return c && c.v === VERSION && typeof c.analytics === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): Consent {
  const c: Consent = { v: VERSION, analytics, at: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    // storage blocked: the choice still applies for this page view
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  return c;
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
