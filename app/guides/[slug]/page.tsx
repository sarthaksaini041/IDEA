import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "../../../components/ads/AdSlot";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { GUIDES, getGuide } from "../../../data/guides";
import { SITE, absoluteUrl } from "../../../lib/site";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: `/guides/${g.slug}` }, openGraph: { type: "article", title: g.title, description: g.description, images: ["/opengraph-image"] } };
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description,
    dateModified: g.updated, url: absoluteUrl(`/guides/${g.slug}`), publisher: { "@type": "Organization", name: SITE.name },
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
        </article>
        <div><AdSlot placement="sidebar" /></div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
