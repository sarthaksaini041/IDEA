import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SITE } from "../../lib/site";

export const metadata: Metadata = { title: "Terms of use", description: `Terms for using ${SITE.name}.`, alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <div className="prose">
      <Breadcrumbs items={[{ name: "Terms", href: "/terms" }]} />
      <h1>Terms of use</h1>
      <p className="muted small">Last updated {SITE.dataUpdated}</p>
      <p>{SITE.name} provides hardware information for general guidance. We work to keep it accurate, but specifications vary by configuration and region, and errors are possible. Always confirm details with the seller or the manufacturer before buying.</p>
      <p>Price alerts are provided as-is. Listings come from third-party marketplaces we do not control; we are not a party to any purchase and cannot guarantee a listing&apos;s accuracy, availability or price.</p>
      <p>Product names and trademarks belong to their owners. {SITE.name} is not affiliated with Lenovo, Dell, HP, Intel, AMD, Plex, Jellyfin or eBay.</p>
      <p>Don&apos;t abuse the alert system (for example automated sign-ups or signing up other people&apos;s addresses). We may remove alerts that do.</p>
    </div>
  );
}
