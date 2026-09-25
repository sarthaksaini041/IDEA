import { newestCpu, CATALOG, fasterThanGigabit, hasLan, measuredIdle, type ModelView } from "../lib/catalog";

// "Best for X" / "which mini PCs have Y" landing pages. Every page is a transparent filter
// over the spec data: the criteria are stated on the page and each result says why it
// matched. A page is only published when enough models match to be useful.

export const MIN_MATCHES = 3;

export interface UseCase {
  slug: string;
  /** Short label for chips and links. */
  label: string;
  /** H1 and <title>. Phrased the way people search. */
  title: string;
  description: string;
  /** Plain-language statement of the filter, shown at the top of the page. */
  criteria: string;
  /** Why the criteria matter for this job. */
  context: string;
  match: (m: ModelView) => boolean;
  /** One line per model explaining what satisfied the criteria. */
  why: (m: ModelView) => string;
  sort?: (a: ModelView, b: ModelView) => number;
  /** Finder URL with the same filter, when one exists. */
  finderQuery?: string;
  guides: string[];
  related: string[];
}

const newestFirst = (a: ModelView, b: ModelView) => b.maxGen - a.maxGen || b.released - a.released;
const cheapestEraFirst = (a: ModelView, b: ModelView) => a.released - b.released || a.maxGen - b.maxGen;
const threads = (m: ModelView) => `up to ${m.maxThreads} threads (${m.cpuList.find((c) => c.threads === m.maxThreads)?.name})`;

export const USE_CASES: UseCase[] = [
  {
    slug: "mini-pcs-with-two-nvme-slots",
    label: "Two NVMe slots",
    title: "Used mini PCs with two M.2 NVMe slots",
    description: "Every used Lenovo Tiny, Dell OptiPlex Micro and HP EliteDesk Mini in our database with two M.2 NVMe SSD slots, for ZFS mirrors or a separate boot and VM drive.",
    criteria: "At least two M.2 slots for NVMe storage (Wi-Fi-only M.2 slots do not count).",
    context: "Two NVMe drives let Proxmox or TrueNAS mirror the boot/VM pool, or keep the OS on one drive and VMs on another. Most 1-litre PCs have only one NVMe slot plus a slower 2.5\" SATA bay.",
    match: (m) => m.storage.m2Nvme >= 2,
    why: (m) => `${m.storage.m2Nvme}× M.2 NVMe + ${m.storage.sata25}× 2.5" SATA`,
    sort: newestFirst,
    finderQuery: "?nvme=2",
    guides: ["mini-pc-nvme-ssd-upgrade", "mini-pc-for-nas"],
    related: ["mini-pcs-with-pcie-slot", "best-mini-pc-for-proxmox"],
  },
  {
    slug: "mini-pcs-with-pcie-slot",
    label: "PCIe slot",
    title: "Used mini PCs with a PCIe slot",
    description: "Which 1-litre business PCs can take a real PCIe card (10GbE NIC, quad-port NIC, HBA or low-profile GPU), and what you need to buy with them.",
    criteria: "A PCIe slot or riser position inside the case.",
    context: "A PCIe slot is what turns a tiny PC into a router, a 10GbE node or a small storage server. In this size it usually needs a model-specific riser card, and the card often takes the place of the 2.5\" drive bay.",
    match: (m) => m.pcieSlot !== "none",
    why: (m) => m.extraNicOption ?? "PCIe slot",
    sort: newestFirst,
    finderQuery: "?pcie=1",
    guides: ["mini-pc-10gbe-network-card", "mini-pc-opnsense-pfsense-router"],
    related: ["mini-pcs-that-support-10gbe", "mini-pcs-with-two-nvme-slots"],
  },
  {
    slug: "mini-pcs-that-support-10gbe",
    label: "10GbE",
    title: "Which used mini PCs support 10GbE?",
    description: "Used 1-litre PCs that can run a 10 Gigabit network card, how they do it, and which of those paths are official versus owner-reported.",
    criteria: "A documented or widely reported path to a 10GbE network card (a PCIe slot, not USB).",
    context: "None of these machines have 10GbE built in. The practical route is a low-profile PCIe card in a riser slot. USB 10GbE adapters exist but are costly and rarely stable enough for a server.",
    match: (m) => hasLan(m, "10GbE"),
    why: (m) => (m.lanUpgrades ?? []).filter((u) => u.speed === "10GbE").map((u) => `${u.via}${u.basis === "community" ? " (owner-reported)" : ""}`).join("; "),
    sort: newestFirst,
    guides: ["mini-pc-10gbe-network-card"],
    related: ["mini-pcs-with-pcie-slot", "mini-pcs-for-opnsense-router"],
  },
  {
    slug: "mini-pcs-with-faster-than-gigabit-networking",
    label: "2.5GbE+ networking",
    title: "Used mini PCs with 2.5GbE or faster networking options",
    description: "Tiny business PCs that can go beyond 1 GbE without USB adapters: factory 2.5GbE options and PCIe slots for 2.5/10GbE cards.",
    criteria: "A factory 2.5GbE option or a PCIe slot that owners use for 2.5/10GbE cards.",
    context: "Every model here ships with 1 GbE. If your NAS or switch is 2.5GbE or faster, the network, not the CPU, becomes the bottleneck for backups and file copies.",
    match: fasterThanGigabit,
    why: (m) => (m.lanUpgrades ?? []).map((u) => `${u.speed}: ${u.via}${u.basis === "community" ? " (owner-reported)" : ""}`).join("; "),
    sort: newestFirst,
    guides: ["mini-pc-10gbe-network-card"],
    related: ["mini-pcs-that-support-10gbe", "mini-pcs-with-pcie-slot"],
  },
  {
    slug: "mini-pcs-that-support-64gb-ram",
    label: "64 GB RAM (official)",
    title: "Used mini PCs that officially support 64 GB of RAM",
    description: "Which Lenovo, Dell and HP 1-litre PCs are rated for 64 GB by the manufacturer, and which only have owner reports of 64 GB working.",
    criteria: "The manufacturer's documented maximum is 64 GB or more.",
    context: "RAM, not CPU, is usually what runs out first on a Proxmox host. Many older models are officially limited to 32 GB even though owners report 2×32 GB kits working; this page lists only official 64 GB support. See the guide for the unofficial cases.",
    match: (m) => m.ram.maxOfficialGB >= 64,
    why: (m) => `${m.ram.maxOfficialGB} GB official, ${m.ram.slots}× ${m.ram.type}-${m.ram.speedMTs}`,
    sort: newestFirst,
    finderQuery: "?ram=64",
    guides: ["do-mini-pcs-support-64gb-ram", "mini-pc-ram-upgrade"],
    related: ["best-mini-pc-for-proxmox"],
  },
  {
    slug: "mini-pcs-with-av1-decode",
    label: "AV1 decode",
    title: "Used mini PCs with AV1 hardware decode",
    description: "Which used business mini PCs can hardware-decode AV1 video for Plex or Jellyfin, and which CPU generation you need to look for in a listing.",
    criteria: "At least one CPU option in the chassis has an iGPU with AV1 hardware decode (Intel 11th gen or newer).",
    context: "AV1 is increasingly used by streaming sources and newer encodes. Without hardware decode, a server transcoding AV1 falls back to the CPU. The chassis alone does not guarantee it: the listing must have the right CPU.",
    match: (m) => m.av1,
    why: (m) => `AV1 on: ${m.cpuList.filter((c) => c.igpuFamily === "intel-xe").map((c) => c.name).join(", ")}`,
    sort: newestFirst,
    finderQuery: "?media=av1",
    guides: ["quick-sync-generations-plex-jellyfin"],
    related: ["best-mini-pc-for-plex-4k"],
  },
  {
    slug: "best-mini-pc-for-plex-4k",
    label: "Plex / Jellyfin 4K",
    title: "Best used mini PCs for Plex and Jellyfin 4K transcoding",
    description: "Used 1-litre PCs whose Intel Quick Sync can hardware-decode 10-bit HEVC (most 4K HDR files), ranked by media engine generation.",
    criteria: "Best CPU option has an Intel iGPU that hardware-decodes 10-bit HEVC (7th gen or newer).",
    context: "For a media server the iGPU generation matters more than core count. 7th–10th gen handle 10-bit HEVC; 11th gen and newer add AV1. AMD APUs work in Jellyfin but are not listed here because Intel Quick Sync is the better-supported path.",
    match: (m) => m.hevc10 && m.vendor === "Intel",
    why: (m) => `${newestCpu(m).igpu} (${newestCpu(m).generation})${m.av1 ? ", plus AV1" : ""}`,
    sort: newestFirst,
    finderQuery: "?media=hevc10&cpu=Intel",
    guides: ["quick-sync-generations-plex-jellyfin"],
    related: ["mini-pcs-with-av1-decode", "best-budget-mini-pc-home-server"],
  },
  {
    slug: "best-mini-pc-for-proxmox",
    label: "Proxmox node",
    title: "Best used mini PCs for a Proxmox node",
    description: "Used Lenovo, Dell and HP tiny PCs that meet sensible Proxmox VE criteria: 6+ threads, two drives and 32 GB+ RAM, with vPro/AMT noted for remote management.",
    criteria: "Best CPU option has 6+ threads, room for two drives and 32 GB+ official RAM, plus at least one kind of headroom: two NVMe slots, 64 GB official RAM, or a PCIe slot.",
    context: "Proxmox itself is light; what limits a node is RAM for VMs, a second drive for storage or mirroring, and enough threads to run several guests. Intel vPro (AMT) on some configurations gives out-of-band remote control, handy for a headless cluster.",
    match: (m) => m.maxThreads >= 6 && m.totalDrives >= 2 && m.ram.maxOfficialGB >= 32 && (m.storage.m2Nvme >= 2 || m.ram.maxOfficialGB >= 64 || m.pcieSlot !== "none"),
    why: (m) => `${threads(m)}; ${[m.storage.m2Nvme >= 2 && "2× NVMe", m.ram.maxOfficialGB >= 64 && "64 GB official", m.pcieSlot !== "none" && "PCIe slot"].filter(Boolean).join(", ")}${m.vpro === "some-skus" ? "; vPro on some CPUs" : ""}`,
    sort: (a, b) => b.maxThreads - a.maxThreads || newestFirst(a, b),
    guides: ["best-used-mini-pc-for-proxmox", "mini-pc-ram-upgrade"],
    related: ["mini-pcs-with-two-nvme-slots", "mini-pcs-that-support-64gb-ram"],
  },
  {
    slug: "mini-pcs-for-opnsense-router",
    label: "OPNsense / pfSense router",
    title: "Used mini PCs that work as an OPNsense or pfSense router",
    description: "1-litre PCs with a way to add a second (or fourth) network port without USB, for OPNsense, pfSense or OpenWrt routers.",
    criteria: "A PCIe slot or a vendor module for a second Ethernet port.",
    context: "A router needs at least two network ports. USB Ethernet adapters work but are the least reliable option for a firewall. A PCIe slot (for a dual/quad-port Intel NIC) or HP's Flex IO network module avoids that.",
    match: (m) => m.pcieSlot !== "none" || m.extraNicOption !== null,
    why: (m) => m.extraNicOption ?? "PCIe slot",
    sort: newestFirst,
    finderQuery: "?nic2=1",
    guides: ["mini-pc-opnsense-pfsense-router"],
    related: ["mini-pcs-with-pcie-slot", "mini-pcs-that-support-10gbe"],
  },
  {
    slug: "best-budget-mini-pc-home-server",
    label: "Budget home server",
    title: "Best budget used mini PCs for a first home server",
    description: "The oldest (and usually cheapest) used 1-litre PCs that still hardware-decode 4K HEVC and have room for two drives: good first home servers for Docker, Home Assistant or Pi-hole.",
    criteria: "7th–9th gen Intel (usually the cheapest used), 10-bit HEVC decode, and at least two drives.",
    context: "For Home Assistant, Pi-hole, Docker and a small Plex library, an older quad/six-core box is plenty. Newer generations mostly add cores and AV1 decode. Prices change daily, so this list is ordered by age, not by a price we cannot verify.",
    match: (m) => m.vendor === "Intel" && m.hevc10 && m.maxGen <= 9 && m.totalDrives >= 2,
    why: (m) => `${m.released}, ${m.cpuList.map((c) => c.name.replace("Core ", "")).join("/")}, ${m.totalDrives} drives`,
    sort: cheapestEraFirst,
    guides: ["check-a-used-mini-pc-listing", "used-mini-pc-vs-n100"],
    related: ["best-mini-pc-for-plex-4k", "best-mini-pc-for-proxmox"],
  },
  {
    slug: "mini-pcs-with-intel-vpro-amt",
    label: "vPro / AMT",
    title: "Used mini PCs with Intel vPro (AMT) remote management",
    description: "Which used business mini PCs offer Intel vPro/AMT for out-of-band remote control of a headless home server, and how to tell if a listing has it.",
    criteria: "Intel vPro is available on at least some CPU configurations of the model.",
    context: "AMT lets you see the screen, reboot and change BIOS settings over the network even when the OS is down, which is useful for a headless cluster. It needs a vPro CPU (e.g. i5-8500T, i7-9700T) and the vPro chipset; check the sticker or BIOS.",
    match: (m) => m.vpro === "some-skus",
    why: (m) => `${m.chipset ?? ""} chipset, vPro on supported CPUs`.trim(),
    sort: newestFirst,
    guides: ["best-used-mini-pc-for-proxmox"],
    related: ["best-mini-pc-for-proxmox"],
  },
];

USE_CASES.push({
  slug: "low-power-mini-pc-home-server",
  label: "Low idle power (measured)",
  title: "Low-power used mini PCs for a 24/7 home server (measured idle)",
  description: "Used Lenovo Tiny, OptiPlex Micro and EliteDesk Mini models with a published wall-meter idle measurement of 15 W or less, with the source and test configuration for each.",
  criteria: "A cited third-party or community wall-meter idle reading whose upper bound is 15 W or less. Models without a published measurement are not listed (not measured is not the same as high).",
  context: "A server that runs all day spends most of its time idle, so idle draw decides the running cost. Each reading below is linked to its source and configuration; drives, BIOS settings and OS change the figure.",
  match: (m) => { const p = (m.power ?? []).find((x) => (x.idleMaxW ?? x.idleW) <= 15); return Boolean(p); },
  why: (m) => { const i = measuredIdle(m)!; return `${i.label} idle (${i.source.label.replace(/:.*/, "")}; ${m.power![0].config})`; },
  sort: (a, b) => (measuredIdle(a)!.idleW - measuredIdle(b)!.idleW) || b.maxGen - a.maxGen,
  guides: ["mini-pc-power-consumption"],
  related: ["best-budget-mini-pc-home-server"],
});

export function matches(u: UseCase): ModelView[] {
  const list = CATALOG.filter(u.match);
  return u.sort ? [...list].sort(u.sort) : list;
}

/** Only pages with enough matches are published (rendered, linked and in the sitemap). */
export const PUBLISHED_USE_CASES = USE_CASES.filter((u) => matches(u).length >= MIN_MATCHES);

export const getUseCase = (slug: string) => PUBLISHED_USE_CASES.find((u) => u.slug === slug);

export function useCasesFor(m: ModelView): UseCase[] {
  return PUBLISHED_USE_CASES.filter((u) => u.match(m));
}
