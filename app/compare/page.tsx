import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { ComparePicker } from "../../components/ComparePicker";
import { COMPARISONS } from "../../data/comparisons";
import { CATALOG } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "Compare used mini PCs side by side",
  description: "Compare up to three used ThinkCentre Tiny, OptiPlex Micro and EliteDesk Mini PCs: NVMe slots, PCIe, RAM, NICs and transcoding. Differences highlighted.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Compare", href: "/compare" }]} />
      <h1>Compare used mini PCs</h1>
      <p className="lede">Pick up to three models. Rows that differ are highlighted.</p>
      <Suspense fallback={<p className="muted">Loading comparison…</p>}>
        <ComparePicker items={CATALOG} />
      </Suspense>
      <h2>Popular head-to-heads</h2>
      <ul>{COMPARISONS.map((c) => <li key={c.slug}><Link href={`/compare/${c.slug}`}>{c.title}</Link>: <span className="muted">{c.question}</span></li>)}</ul>
    </>
  );
}
