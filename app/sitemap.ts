import type { MetadataRoute } from "next";
import { COMPARISONS } from "../data/comparisons";
import { GUIDES } from "../data/guides";
import { CATALOG } from "../lib/catalog";
import { SITE, absoluteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const d = new Date(SITE.dataUpdated);
  return [
    { url: absoluteUrl("/"), lastModified: d, priority: 1 },
    { url: absoluteUrl("/compare"), lastModified: d },
    { url: absoluteUrl("/guides"), lastModified: d },
    { url: absoluteUrl("/alerts"), lastModified: d },
    ...CATALOG.map((m) => ({ url: absoluteUrl(`/models/${m.slug}`), lastModified: d, priority: 0.8 })),
    ...COMPARISONS.map((c) => ({ url: absoluteUrl(`/compare/${c.slug}`), lastModified: d, priority: 0.7 })),
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: new Date(g.updated), priority: 0.7 })),
    ...["/about", "/privacy", "/cookies", "/terms", "/contact"].map((p) => ({ url: absoluteUrl(p), lastModified: d, priority: 0.2 })),
  ];
}
