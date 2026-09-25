import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { PUBLISHED_USE_CASES, matches } from "../../data/usecases";

export const metadata: Metadata = {
  title: "Best used mini PCs by use case",
  description: "Used Lenovo Tiny, Dell OptiPlex Micro and HP EliteDesk Mini PCs filtered by what you need: Proxmox, Plex 4K, 10GbE, two NVMe slots, 64 GB RAM, routers and more.",
  alternates: { canonical: "/best" },
};

export default function BestIndex() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Best for", href: "/best" }]} />
      <h1>Best used mini PCs by use case</h1>
      <p className="lede">Each list is a transparent filter over our spec data: the criteria are stated on the page and every model says why it matched.</p>
      <ul className="cards">
        {PUBLISHED_USE_CASES.map((u) => (
          <li key={u.slug} className="card">
            <Link className="card__title" href={`/best/${u.slug}`}>{u.title}</Link>
            <span className="small muted">{matches(u).length} models · {u.criteria}</span>
          </li>
        ))}
      </ul>
      <p><Link href="/which-mini-pc">Not sure? Answer a few questions →</Link></p>
    </>
  );
}
