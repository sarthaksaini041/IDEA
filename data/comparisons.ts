import { newestCpu, CATALOG, type ModelView } from "../lib/catalog";

// Head-to-head pages. Pairs come from two sources:
//  1. CURATED: pairs repeatedly cross-shopped in r/homelab, r/HomeServer and r/Proxmox
//     threads, with a hand-written framing question.
//  2. RULES: only combinations a buyer would realistically weigh against each other:
//     - the next generation of the same product line (upgrade question),
//     - the budget vs business tier of the same generation and brand,
//     - the same CPU generation from a different brand (cross-shop question).
// Random combinations (e.g. a 2016 box vs a 2022 one from another brand) are never made.
export interface Comparison { slug: string; a: string; b: string; title: string; question: string; kind: "curated" | "successor" | "tier" | "cross-brand" }

const short = (slug: string) => slug.replace(/^(lenovo-thinkcentre|dell-optiplex|hp)-/, "");
export const pairSlug = (a: string, b: string) => `${short(a)}-vs-${short(b)}`;

const byslug = (s: string) => {
  const v = CATALOG.find((m) => m.slug === s);
  if (!v) throw new Error(`Comparison references unknown model ${s}`);
  return v;
};

const CURATED: [string, string, string][] = [
  ["lenovo-thinkcentre-m720q", "lenovo-thinkcentre-m920q", "Is the M920q worth paying more than the M720q?"],
  ["lenovo-thinkcentre-m920q", "lenovo-thinkcentre-m920x", "Which one has two NVMe slots?"],
  ["lenovo-thinkcentre-m920q", "hp-elitedesk-800-g4-mini", "Which is the better Proxmox node?"],
  ["hp-elitedesk-800-g4-mini", "dell-optiplex-7060-micro", "HP EliteDesk or Dell OptiPlex?"],
  ["hp-elitedesk-800-g3-mini", "dell-optiplex-7050-micro", "Which 7th-gen box for a first home server?"],
  ["lenovo-thinkcentre-m720q", "dell-optiplex-3080-micro", "PCIe riser or newer 10th-gen CPU?"],
  ["lenovo-thinkcentre-m920q", "dell-optiplex-7070-micro", "The two most common used home-server boxes: which should you buy?"],
  ["lenovo-thinkcentre-m920q", "hp-elitedesk-800-g5-mini", "PCIe riser or two NVMe slots?"],
  ["lenovo-thinkcentre-m90q-gen-1", "hp-elitedesk-800-g6-mini", "Which 10th-gen tiny PC for Proxmox?"],
  ["hp-elitedesk-800-g6-mini", "hp-elitedesk-800-g8-mini", "Is 11th gen worth it for AV1?"],
];

const make = (a: ModelView, b: ModelView, question: string, kind: Comparison["kind"]): Comparison => ({
  slug: pairSlug(a.slug, b.slug), a: a.slug, b: b.slug, title: `${a.shortName} vs ${b.shortName}`, question, kind,
});

const businessTier = (m: ModelView) => /M9\d|OptiPlex 7\d\d0|800 G/.test(m.name);

function generate(): Comparison[] {
  const out = new Map<string, Comparison>();
  const key = (a: string, b: string) => [a, b].sort().join("|");
  const add = (c: Comparison) => { if (!out.has(key(c.a, c.b))) out.set(key(c.a, c.b), c); };

  for (const [a, b, q] of CURATED) add(make(byslug(a), byslug(b), q, "curated"));

  const intel = CATALOG.filter((m) => m.vendor === "Intel");
  // Successors within the same product line (sorted by release).
  const lines = new Map<string, ModelView[]>();
  for (const m of CATALOG) {
    const line = `${m.brand}|${m.vendor}|${businessTier(m) ? "biz" : "budget"}`;
    lines.set(line, [...(lines.get(line) ?? []), m]);
  }
  for (const list of lines.values()) {
    for (const a of list) {
      // The next CPU generation in the same line (variants of the same generation are not "successors").
      const nextGen = Math.min(...list.filter((b) => b.maxGen > a.maxGen).map((b) => b.maxGen));
      for (const b of list.filter((x) => x.maxGen === nextGen)) add(make(a, b, `Is the ${b.shortName} worth the upgrade over the ${a.shortName}?`, "successor"));
    }
  }
  // Budget vs business tier, same brand and CPU generation.
  for (const a of intel) for (const b of intel) {
    if (a.slug < b.slug && a.brand === b.brand && a.maxGen === b.maxGen && businessTier(a) !== businessTier(b)) {
      const [lo, hi] = businessTier(a) ? [b, a] : [a, b];
      add(make(lo, hi, `What do you get for the extra money with the ${hi.shortName}?`, "tier"));
    }
  }
  // Same generation, different brand: the classic cross-shop.
  for (const a of intel) for (const b of intel) {
    if (a.slug < b.slug && a.brand !== b.brand && a.maxGen === b.maxGen && businessTier(a) === businessTier(b)) {
      add(make(a, b, `${a.brand} or ${b.brand}: which ${newestCpu(a).generation.replace(/ \(.*/, "")} box is the better home server?`, "cross-brand"));
    }
  }
  return [...out.values()];
}

export const COMPARISONS: Comparison[] = generate();

export const comparisonsFor = (slug: string) => COMPARISONS.filter((c) => c.a === slug || c.b === slug);
