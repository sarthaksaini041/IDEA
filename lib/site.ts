// Central site configuration. Everything environment-specific is read here, once.
export const SITE = {
  name: "TinyLab Finder",
  tagline: "Used mini PCs for home servers, compared properly",
  // Explicit URL wins; on Vercel fall back to the production domain it provides; else local dev.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  dataUpdated: "2026-09-25",
};

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
