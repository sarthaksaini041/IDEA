import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "../../../components/ads/AdSlot";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { ListingLinks } from "../../../components/ListingLinks";
import { MediaTable } from "../../../components/MediaTable";
import { SpecSheet } from "../../../components/SpecSheet";
import { CATALOG, alternatives, getView } from "../../../lib/catalog";
import { MEDIA, VERDICT_TEXT } from "../../../lib/media";
import { SITE, absoluteUrl } from "../../../lib/site";
import { COMPARISONS } from "../../../data/comparisons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATALOG.map((m) => ({ slug: m.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getView((await params).slug);
  if (!m) return {};
  const title = `${m.shortName} specs: max RAM, NVMe slots, PCIe & Quick Sync`;
  const description = `${m.name}: ${m.storage.m2Nvme}× M.2 NVMe + ${m.storage.sata25}× 2.5" SATA, ${m.ram.maxOfficialGB} GB official max RAM, ${m.pcieSlot === "none" ? "no PCIe slot" : "PCIe expansion"}. ${VERDICT_TEXT[m.verdict]}. What to check before buying one used.`;
  return {
    title,
    description,
    alternates: { canonical: `/models/${m.slug}` },
    openGraph: { title, description, url: `/models/${m.slug}`, images: ["/opengraph-image"] },
  };
}

export default async function ModelPage({ params }: Props) {
  const m = getView((await params).slug);
  if (!m) notFound();
  const alts = alternatives(m);
  const related = COMPARISONS.filter((c) => c.a === m.slug || c.b === m.slug);
  const families = m.cpuList.map((c) => c.igpuFamily);
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${m.name} specifications`,
    url: absoluteUrl(`/models/${m.slug}`),
    dateModified: SITE.dataUpdated,
    about: { "@type": "Thing", name: m.name },
  };

  return (
    <>
      <Breadcrumbs items={[{ name: "Models", href: "/#main" }, { name: m.shortName, href: `/models/${m.slug}` }]} />
      <div className="layout layout--side">
        <article>
          <h1>{m.name}</h1>
          <p className="lede">
            A {m.released} {m.family} {m.chipset ? `on the ${m.chipset} chipset ` : ""}with {m.storage.m2Nvme} M.2 NVMe{" "}
            {m.storage.m2Nvme === 1 ? "slot" : "slots"}, {m.storage.sata25} 2.5&quot; bay and up to {m.ram.maxOfficialGB} GB of
            RAM (official).{" "}
            {m.pcieSlot !== "none" ? "It can take a PCIe card, which is rare in this size." : m.extraNicOption ? "It has a vendor slot for a second network port." : "It has no internal expansion slot."}
          </p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span className="verdict"><span className={`dot dot--${m.verdict}`} aria-hidden="true" />{VERDICT_TEXT[m.verdict]}</span>
            {m.confidence === "high" ? (
              <span className="badge badge--high">Specs widely confirmed</span>
            ) : (
              <span className="badge badge--check">Verify specs before buying</span>
            )}
          </p>
          {m.confidence === "check" && (
            <p className="notice small">
              We have not yet checked every field on this page against the official {m.brand} manual. Treat slot counts and
              RAM limits as a starting point and confirm them for the exact machine type in a listing.{" "}
              <Link href="/contact">Know the answer? Send a correction.</Link>
            </p>
          )}

          <h2>Specifications</h2>
          <SpecSheet m={m} />

          {m.notes.length > 0 && (
            <>
              <h2>What owners should know</h2>
              <ul className="prose">{m.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </>
          )}

          <AdSlot placement="in-content" />

          <h2>Plex and Jellyfin transcoding</h2>
          <p className="prose">{MEDIA[m.bestIgpu].note} The table covers every CPU option sold in this chassis. Check which CPU a listing actually has.</p>
          <MediaTable families={families} />
          <p className="small muted">
            Plex needs a Plex Pass for hardware transcoding; Jellyfin does not. More detail in{" "}
            <Link href="/guides/quick-sync-generations-plex-jellyfin">our Quick Sync generations guide</Link>.
          </p>

          <h2>Before you buy one used</h2>
          <ul className="prose">
            <li>Confirm the exact CPU model in the listing photos or System Information screenshot, not just &quot;Core i5&quot;.</li>
            <li>Check that a power adapter of the right wattage is included{m.psuW ? ` (${m.psuW.map((w) => `${w} W`).join(" or ")})` : ""}. Many ex-office units ship without one.</li>
            <li>Ask whether the BIOS is unlocked. Ex-corporate machines sometimes keep an admin password.</li>
            {m.storage.sata25 > 0 && <li>A 2.5&quot; drive needs the caddy and cable, which are often missing when a unit shipped with only an M.2 SSD.</li>}
            {m.pcieSlot !== "none" && <li>The PCIe riser is usually not included. Budget for it separately.</li>}
          </ul>
          <p><Link href="/guides/check-a-used-mini-pc-listing">Full listing checklist →</Link></p>

          <h2>Find one</h2>
          <ListingLinks model={m} />
          <p>
            <Link className="btn btn--primary" href={`/alerts?model=${m.slug}`}>Email me when one is listed under my price</Link>
          </p>

          {related.length > 0 && (
            <>
              <h2>Head-to-head comparisons</h2>
              <ul>{related.map((c) => <li key={c.slug}><Link href={`/compare/${c.slug}`}>{c.title}</Link></li>)}</ul>
            </>
          )}

          <h2>Similar models to consider</h2>
          <ul className="cards">
            {alts.map((a) => (
              <li key={a.slug} className="card">
                <Link href={`/models/${a.slug}`} className="card__title">{a.name}</Link>
                <span className="small muted">
                  {a.storage.m2Nvme}× NVMe · {a.ram.maxOfficialGB} GB max · {a.pcieSlot === "none" ? "no PCIe" : "PCIe"} · {VERDICT_TEXT[a.verdict]}
                </span>
              </li>
            ))}
          </ul>
          <p><Link href={`/compare?m=${[m.slug, ...alts.slice(0, 2).map((a) => a.slug)].join(",")}`}>Compare these side by side →</Link></p>
        </article>
        <div><AdSlot placement="sidebar" /></div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
