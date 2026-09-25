import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "../../../components/ads/AdSlot";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { GUIDES, getGuide } from "../../../data/guides";
import { PUBLISHED_USE_CASES } from "../../../data/usecases";
import { SITE, absoluteUrl } from "../../../lib/site";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: `/guides/${g.slug}` }, openGraph: { type: "article", title: g.title, description: g.description, url: `/guides/${g.slug}`, images: ["/opengraph-image"], modifiedTime: g.updated }, twitter: { card: "summary_large_image", title: g.title, description: g.description } };
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  // Links to /best pages that are not published (too few matching models) are dropped.
  const related = (g.related ?? []).filter((r) => !r.href.startsWith("/best/") || PUBLISHED_USE_CASES.some((u) => `/best/${u.slug}` === r.href));
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description,
    dateModified: g.updated, url: absoluteUrl(`/guides/${g.slug}`), mainEntityOfPage: absoluteUrl(`/guides/${g.slug}`),
    author: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/about") }, publisher: { "@type": "Organization", name: SITE.name },
  };
  return (
    <>
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: g.title, href: `/guides/${g.slug}` }]} />
      <div className="layout layout--side">
        <article className="prose">
          <h1>{g.title}</h1>
          <p className="muted small">Updated {g.updated}</p>
          {g.body()}
          <AdSlot placement="in-content" />
          {related.length > 0 && (
            <>
              <h2>Related</h2>
              <ul>{related.map((r) => <li key={r.href}><Link href={r.href}>{r.label}</Link></li>)}</ul>
            </>
          )}
        </article>
        <div><AdSlot placement="sidebar" /></div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
