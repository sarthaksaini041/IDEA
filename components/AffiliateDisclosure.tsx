import Link from "next/link";
import { amazonEnabled } from "../lib/affiliate/amazon";
import { isAffiliate } from "../lib/listings";

/** Shown next to outbound shopping links only when an affiliate program is actually active. */
export function AffiliateDisclosure() {
  const programs = [isAffiliate() && "eBay Partner Network", amazonEnabled() && "Amazon Associates"].filter(Boolean);
  if (!programs.length) return null;
  return (
    <p className="small muted">
      Disclosure: some links on this page are affiliate links ({programs.join(" and ")}). If you buy through them we may earn a
      commission at no extra cost to you.{amazonEnabled() && " As an Amazon Associate we earn from qualifying purchases."} <Link href="/about#affiliate">How we make money</Link>.
    </p>
  );
}
