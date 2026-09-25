import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { GUIDES } from "../../data/guides";

export const metadata: Metadata = {
  title: "Guides for buying used mini PCs for home servers",
  description: "Practical guides: which CPU generations transcode 4K for Plex and Jellyfin, and how to check a used mini PC listing before buying.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <h1>Guides</h1>
      <ul className="guide-list">
        {GUIDES.map((g) => (
          <li key={g.slug} className="card">
            <Link href={`/guides/${g.slug}`} className="card__title">{g.title}</Link>
            <span className="muted small">{g.description}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
