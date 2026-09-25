import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { MODELS } from "../../data/models";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: "About and methodology",
  description: `How ${SITE.name} collects and checks mini PC specifications, what the confidence labels mean, and how the site makes money.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  const high = MODELS.filter((m) => m.confidence === "high").length;
  return (
    <div className="prose">
      <Breadcrumbs items={[{ name: "About", href: "/about" }]} />
      <h1>About &amp; methodology</h1>
      <p>
        {SITE.name} exists because the same questions come up every day in home-server communities: which used office
        mini PC has two NVMe slots, which one takes a PCIe card, which generation transcodes 4K, and whether a listing is a
        fair price. The answers are scattered across manuals, reviews and forum threads, and listing titles are often wrong.
      </p>
      <h2>Where the data comes from</h2>
      <ul>
        <li>Chassis specifications (slots, bays, RAM limits, chipset, NIC) follow the manufacturer&apos;s published specifications and hardware maintenance manuals.</li>
        <li>Video-engine capabilities are stored once per CPU generation and applied to every model that uses it, so they stay consistent.</li>
        <li>Unofficial-but-common facts (such as 64 GB working where 32 GB is the official limit) are written as owner notes and never mixed into the official figures.</li>
        <li>Measured values such as idle power are shown only when actually measured. Until then the page says &quot;not measured yet&quot;. We do not estimate them.</li>
      </ul>
      <h2>Confidence labels</h2>
      <p>
        <span className="badge badge--high">Specs widely confirmed</span> means the key figures (RAM limit, drive slots,
        PCIe, network chip) were checked against the manufacturer&apos;s spec sheet or service manual, linked on each model page. <span className="badge badge--check">Verify specs</span> means
        at least one key figure could not be confirmed from an official document we could access. {high} of{" "}
        {MODELS.length} models are currently in the first group. Found an error? <Link href="/contact">Tell us</Link>; corrections are the fastest way this site improves.
      </p>
      <h2 id="affiliate">How the site is funded</h2>
      <p>
        Through display advertising and, where enabled, marketplace affiliate links (eBay Partner Network, and Amazon Associates
        for upgrade parts). Neither changes which models are listed, how they are described, or their order. Ads are always
        labelled &quot;Advertisement&quot; and kept apart from the content. Affiliate links are marked with a disclosure next to them.
      </p>
      <h2>Prices and power figures</h2>
      <p>
        We only show a price when it comes from a live marketplace feed, with the date it was checked, and we never estimate one.
        Price history charts show stored observations only. Power figures are published only with a source, the configuration
        and the measurement method; otherwise a model page says &quot;Not measured yet&quot;.
      </p>
    </div>
  );
}
