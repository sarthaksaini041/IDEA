import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlertForm } from "../../components/AlertForm";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CATALOG } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "Price alerts for used mini PCs",
  description: "Get an email when a used ThinkCentre Tiny, OptiPlex Micro or EliteDesk Mini is listed on eBay under your target price.",
  alternates: { canonical: "/alerts" },
};

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AlertsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  return (
    <>
      <Breadcrumbs items={[{ name: "Price alerts", href: "/alerts" }]} />
      <div className="prose">
        <h1>Price alerts</h1>
        <p className="lede">Pick a model and the most you want to pay. We check current fixed-price eBay listings and email you when one matches.</p>
        {status === "confirmed" && <p className="notice notice--ok" role="status">Your alert is confirmed. You will hear from us when a matching listing appears.</p>}
        {status === "invalid" && <p className="notice notice--err" role="alert">That confirmation link is invalid or was already used.</p>}
        <Suspense fallback={<p className="muted">Loading form…</p>}>
          <AlertForm models={CATALOG.map((m) => ({ slug: m.slug, name: m.name }))} />
        </Suspense>
        <h2>How matching works</h2>
        <ul>
          <li>We search listing titles for the model name and skip obvious parts listings (caddies, adapters, &quot;for parts&quot;).</li>
          <li>Titles are messy. Always check the CPU, RAM, storage and power adapter in the listing itself. <Link href="/guides/check-a-used-mini-pc-listing">Our checklist</Link> helps.</li>
          <li>Prices are asking prices from active listings, not sold prices.</li>
        </ul>
      </div>
    </>
  );
}
