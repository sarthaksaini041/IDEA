import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "../../../components/ads/AdSlot";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { CompareTable, differences } from "../../../components/CompareTable";
import { COMPARISONS } from "../../../data/comparisons";
import { getView } from "../../../lib/catalog";

type Props = { params: Promise<{ pair: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ pair: c.slug }));
}
function load(slug: string) {
  const c = COMPARISONS.find((x) => x.slug === slug);
  if (!c) return null;
  const a = getView(c.a);
  const b = getView(c.b);
  return a && b ? { c, a, b } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = load((await params).pair);
  if (!d) return {};
  return {
    title: `${d.c.title} for a home server`,
    description: `${d.c.question} ${differences(d.a, d.b)[0]}`,
    alternates: { canonical: `/compare/${d.c.slug}` },
  };
}

export default async function PairPage({ params }: Props) {
  const d = load((await params).pair);
  if (!d) notFound();
  const { c, a, b } = d;
  return (
    <>
      <Breadcrumbs items={[{ name: "Compare", href: "/compare" }, { name: c.title, href: `/compare/${c.slug}` }]} />
      <h1>{c.title}</h1>
      <p className="lede">{c.question} The differences that matter for a home server:</p>
      <ul className="prose">{differences(a, b).map((t) => <li key={t}>{t}</li>)}</ul>
      <AdSlot placement="in-content" />
      <h2>Full spec comparison</h2>
      <CompareTable models={[a, b]} />
      {(a.confidence === "check" || b.confidence === "check") && (
        <p className="notice small">At least one of these models has specs we have not fully verified against the official manual. Confirm slot counts for the exact machine type before buying.</p>
      )}
      <p className="btn-row">
        <Link className="btn" href={`/models/${a.slug}`}>{a.shortName} details</Link>
        <Link className="btn" href={`/models/${b.slug}`}>{b.shortName} details</Link>
      </p>
    </>
  );
}
