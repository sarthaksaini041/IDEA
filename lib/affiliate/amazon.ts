// Amazon Associates. OFF until a real Associates tracking ID is configured.
// - NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG: your tracking ID, e.g. "yourtag-20" (format checked).
// - NEXT_PUBLIC_AMAZON_HOST: storefront host, default www.amazon.com.
// Amazon's Operating Agreement forbids showing Amazon prices unless they come from its API
// (Creators API, which itself needs 10 qualifying sales in the last 30 days), so this site
// never displays Amazon prices: links are plain search links with the tag.
const TAG_RE = /^[a-z0-9][a-z0-9-]{1,40}-\d{2}$/i;

export function amazonTag(): string | null {
  const t = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim();
  return t && TAG_RE.test(t) ? t : null;
}

export const amazonEnabled = () => amazonTag() !== null;

/** Search link carrying the tag, or null when Amazon is not configured. Never a fake link. */
export function amazonSearchUrl(keywords: string): string | null {
  const tag = amazonTag();
  if (!tag) return null;
  const host = process.env.NEXT_PUBLIC_AMAZON_HOST?.trim() || "www.amazon.com";
  if (!/^www\.amazon\.[a-z.]{2,6}$/.test(host)) return null;
  return `https://${host}/s?${new URLSearchParams({ k: keywords, tag }).toString()}`;
}
