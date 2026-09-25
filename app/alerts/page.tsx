import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlertForm } from "../../components/AlertForm";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { getSessionUser } from "../../lib/auth/session";
import { CATALOG } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "Price alerts for used mini PCs",
  description: "Get an email when a used ThinkCentre Tiny, OptiPlex Micro or EliteDesk Mini is listed on eBay under your target price.",
  alternates: { canonical: "/alerts" },
};

type Props = { searchParams: Promise<{ model?: string }> };

export default async function AlertsPage({ searchParams }: Props) {
  const user = await getSessionUser();
  const { model } = await searchParams;
  const next = `/alerts${model ? `?model=${encodeURIComponent(model)}` : ""}`;
  return (
    <>
      <Breadcrumbs items={[{ name: "Price alerts", href: "/alerts" }]} />
      <div className="prose">
        <h1>Price alerts</h1>
        <p className="lede">Pick a model and the most you want to pay. We check current fixed-price eBay listings every day and email you when one matches.</p>
        {user ? (
          <Suspense fallback={<p className="muted">Loading form…</p>}>
            <AlertForm models={CATALOG.map((m) => ({ slug: m.slug, name: m.name }))} email={user.email} />
          </Suspense>
        ) : (
          <div className="panel">
            <p style={{ marginTop: 0 }}><strong>Alerts need a free account</strong> so we know where to send them. It takes under a minute: name, email, password and a code.</p>
            <p className="btn-row" style={{ marginBottom: 0 }}>
              <Link className="btn btn--primary" href={`/signup?next=${encodeURIComponent(next)}`}>Create free account</Link>
              <Link className="btn" href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>
            </p>
            <p className="small muted" style={{ marginBottom: 0 }}>The finder, comparisons and guides work without an account.</p>
          </div>
        )}
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
