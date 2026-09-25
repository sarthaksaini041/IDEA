// Used 1-litre business PCs popular for home servers.
//
// DATA POLICY
// - Only fields we can state with reasonable confidence are filled in.
// - `confidence: "high"` = consistent across manufacturer docs and widely confirmed by owners.
//   `confidence: "check"` = believed correct but not yet verified against the official
//   manual; the UI shows a visible "verify before buying" badge for these.
// - Measured values (idle power) are null until someone measures them. Never estimate them.
// - Unofficial-but-common facts (e.g. 64 GB working where 32 GB is official) go in `notes`,
//   never in the official field.

export type Brand = "Lenovo" | "Dell" | "HP";

export interface Model {
  slug: string;
  brand: Brand;
  family: string; // "ThinkCentre Tiny", "OptiPlex Micro", "EliteDesk Mini"...
  name: string; // full display name
  shortName: string;
  released: number; // year
  chipset: string | null;
  cpus: string[]; // ids from data/cpus.ts (common configurations, not exhaustive)
  ram: { slots: number; type: "DDR4"; maxOfficialGB: number; speedMTs: number };
  storage: { m2Nvme: number; sata25: number };
  pcieSlot: "none" | "riser-x8" | "riser" | "gpu-option";
  nic: string | null; // onboard Ethernet chip
  extraNicOption: string | null; // e.g. HP Flex IO, Lenovo riser NIC
  vpro: "some-skus" | "no" | null;
  psuW: number[] | null;
  idleW: number | null; // measured wall draw at idle; null = not measured yet
  confidence: "high" | "check";
  searchAliases: string[];
  notes: string[];
}

const m = (x: Model) => x;

export const MODELS: Model[] = [
  // ---------------- Lenovo ThinkCentre Tiny ----------------
  m({
    slug: "lenovo-thinkcentre-m710q",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M710q Tiny", shortName: "M710q",
    released: 2017, chipset: "B250",
    cpus: ["i3-7100t", "i5-7500t", "i5-6500t", "i7-7700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2400 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-V", extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["m710q", "m710 tiny"],
    notes: [
      "7th-gen CPUs are the better pick here: they add hardware decode for 10-bit HEVC.",
    ],
  }),
  m({
    slug: "lenovo-thinkcentre-m720q",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M720q Tiny", shortName: "M720q",
    released: 2018, chipset: "B360",
    cpus: ["i3-8100t", "i5-8500t", "i5-9500t", "i7-8700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "riser-x8",
    nic: "Intel I219-V", extraNicOption: "PCIe x8 card via Lenovo riser (replaces the 2.5\" bay)", vpro: "no", psuW: [65, 90],
    idleW: null, confidence: "high", searchAliases: ["m720q", "m720 tiny", "thinkcentre tiny"],
    notes: [
      "The PCIe riser is the reason this model is popular for routers (OPNsense/pfSense) and 10GbE: it takes a low-profile PCIe card.",
      "Owners commonly run 64 GB (2×32 GB), but Lenovo's official maximum is 32 GB.",
      "Installing the riser card uses the space of the 2.5\" drive bay.",
    ],
  }),
  m({
    slug: "lenovo-thinkcentre-m920q",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M920q Tiny", shortName: "M920q",
    released: 2018, chipset: "Q370",
    cpus: ["i5-8500t", "i5-9500t", "i7-8700t", "i7-9700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "riser-x8",
    nic: "Intel I219-LM", extraNicOption: "PCIe x8 card via Lenovo riser (replaces the 2.5\" bay)", vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "high", searchAliases: ["m920q", "m920 tiny"],
    notes: [
      "Only one M.2 NVMe slot. The two-slot model is the M920x, a common mix-up in listings.",
      "Business chipset (Q370) and I219-LM Ethernet; vPro/AMT remote management on vPro CPU configurations.",
    ],
  }),
  m({
    slug: "lenovo-thinkcentre-m920x",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M920x Tiny", shortName: "M920x",
    released: 2018, chipset: "Q370",
    cpus: ["i5-8500t", "i5-9500t", "i7-8700t", "i7-9700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "gpu-option",
    nic: "Intel I219-LM", extraNicOption: "PCIe slot (shipped with a discrete GPU on some configurations)", vpro: "some-skus", psuW: [135],
    idleW: null, confidence: "check", searchAliases: ["m920x"],
    notes: [
      "Two M.2 NVMe slots, which makes it a good pick for ZFS mirrors or a boot + data split.",
      "Usually costs more than the M920q on the used market because it is rarer.",
    ],
  }),
  m({
    slug: "lenovo-thinkcentre-m75q-gen-1",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M75q-1 Tiny", shortName: "M75q-1",
    released: 2019, chipset: null,
    cpus: ["r5-3400ge"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: null, psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["m75q-1", "m75q gen 1"],
    notes: ["AMD Ryzen PRO APU. Good multi-thread value, weaker media-server support than Intel Quick Sync."],
  }),
  m({
    slug: "lenovo-thinkcentre-m75q-gen-2",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M75q Gen 2 Tiny", shortName: "M75q Gen 2",
    released: 2020, chipset: null,
    cpus: ["r5-4650ge", "r7-4750ge"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 3200 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: null, psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["m75q gen 2", "m75q-2"],
    notes: ["6–8 Zen 2 cores at 35 W: one of the strongest CPUs in this class for VMs and containers."],
  }),
  m({
    slug: "lenovo-thinkcentre-m70q-gen-1",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M70q Gen 1 Tiny", shortName: "M70q Gen 1",
    released: 2020, chipset: null,
    cpus: ["i3-10100t", "i5-10500t", "i7-10700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["m70q", "m70q gen 1"],
    notes: ["10th gen adds Hyper-Threading to i3/i5 T-series chips (e.g. i5-10500T is 6C/12T)."],
  }),
  m({
    slug: "lenovo-thinkcentre-m90q-gen-1",
    brand: "Lenovo", family: "ThinkCentre Tiny", name: "Lenovo ThinkCentre M90q Gen 1 Tiny", shortName: "M90q Gen 1",
    released: 2020, chipset: "Q470",
    cpus: ["i5-10500t", "i7-10700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2666 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "riser",
    nic: "Intel I219-LM", extraNicOption: "Expansion via Lenovo riser options", vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "check", searchAliases: ["m90q", "m90q gen 1"],
    notes: ["Two M.2 slots plus 10th-gen CPUs with Hyper-Threading: a strong Proxmox node if priced near an M920q."],
  }),

  // ---------------- Dell OptiPlex Micro ----------------
  m({
    slug: "dell-optiplex-3050-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 3050 Micro", shortName: "OptiPlex 3050 Micro",
    released: 2017, chipset: null,
    cpus: ["i3-7100t", "i5-7500t", "i5-6500t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2400 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["3050 micro", "optiplex 3050"],
    notes: ["Budget line. Often the cheapest way into a 7th-gen Quick Sync box for a single-service server."],
  }),
  m({
    slug: "dell-optiplex-7050-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 7050 Micro", shortName: "OptiPlex 7050 Micro",
    released: 2017, chipset: "Q270",
    cpus: ["i5-6500t", "i5-7500t", "i7-7700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2400 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: null, vpro: "some-skus", psuW: [65],
    idleW: null, confidence: "high", searchAliases: ["7050 micro", "optiplex 7050"],
    notes: ["Check the CPU in a listing: 6th-gen units lack 10-bit HEVC hardware decode, 7th-gen units have it."],
  }),
  m({
    slug: "dell-optiplex-3060-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 3060 Micro", shortName: "OptiPlex 3060 Micro",
    released: 2018, chipset: null,
    cpus: ["i3-8100t", "i5-8500t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["3060 micro", "optiplex 3060"],
    notes: [],
  }),
  m({
    slug: "dell-optiplex-7060-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 7060 Micro", shortName: "OptiPlex 7060 Micro",
    released: 2018, chipset: "Q370",
    cpus: ["i5-8500t", "i7-8700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: null, vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "high", searchAliases: ["7060 micro", "optiplex 7060"],
    notes: ["No PCIe expansion. If you need a second NIC, use USB Ethernet or pick an M720q/M920q instead."],
  }),
  m({
    slug: "dell-optiplex-3070-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 3070 Micro", shortName: "OptiPlex 3070 Micro",
    released: 2019, chipset: null,
    cpus: ["i3-9100t", "i5-9500t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["3070 micro", "optiplex 3070"],
    notes: [],
  }),
  m({
    slug: "dell-optiplex-7070-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 7070 Micro", shortName: "OptiPlex 7070 Micro",
    released: 2019, chipset: "Q370",
    cpus: ["i5-9500t", "i7-9700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: null, vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "check", searchAliases: ["7070 micro", "optiplex 7070"],
    notes: [],
  }),
  m({
    slug: "dell-optiplex-3080-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 3080 Micro", shortName: "OptiPlex 3080 Micro",
    released: 2020, chipset: null,
    cpus: ["i3-10100t", "i5-10500t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["3080 micro", "optiplex 3080"],
    notes: ["A common beginner pick in 2026: 10th-gen i5 with Hyper-Threading at a low used price."],
  }),
  m({
    slug: "dell-optiplex-7080-micro",
    brand: "Dell", family: "OptiPlex Micro", name: "Dell OptiPlex 7080 Micro", shortName: "OptiPlex 7080 Micro",
    released: 2020, chipset: "Q470",
    cpus: ["i5-10500t", "i7-10700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2933 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: null, vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "check", searchAliases: ["7080 micro", "optiplex 7080"],
    notes: [],
  }),

  // ---------------- HP EliteDesk / ProDesk Mini ----------------
  m({
    slug: "hp-elitedesk-800-g2-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 800 G2 Mini", shortName: "EliteDesk 800 G2 Mini",
    released: 2016, chipset: "Q170",
    cpus: ["i5-6500t", "i7-6700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2133 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: null, vpro: "some-skus", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["800 g2 mini", "elitedesk g2"],
    notes: [
      "Cheap, but 6th-gen Quick Sync cannot hardware-decode 10-bit HEVC. Owners in 2026 describe it as fine for light services, not for 4K Plex.",
    ],
  }),
  m({
    slug: "hp-elitedesk-800-g3-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 800 G3 Mini", shortName: "EliteDesk 800 G3 Mini",
    released: 2017, chipset: "Q270",
    cpus: ["i5-6500t", "i5-7500t", "i7-7700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2400 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: "HP Flex IO module", vpro: "some-skus", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["800 g3 mini", "elitedesk g3"],
    notes: [],
  }),
  m({
    slug: "hp-elitedesk-800-g4-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 800 G4 Mini", shortName: "EliteDesk 800 G4 Mini",
    released: 2018, chipset: "Q370",
    cpus: ["i5-8500t", "i7-8700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: "HP Flex IO module (e.g. second Ethernet port)", vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "high", searchAliases: ["800 g4 mini", "elitedesk g4", "elitedesk 800 g4"],
    notes: [
      "Up to three drives: two M.2 NVMe plus one 2.5\" SATA.",
      "The Flex IO port can take an HP network module, giving a second NIC without USB adapters.",
      "Owners commonly run 64 GB, but HP's official maximum is 32 GB.",
    ],
  }),
  m({
    slug: "hp-elitedesk-800-g5-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 800 G5 Mini", shortName: "EliteDesk 800 G5 Mini",
    released: 2019, chipset: "Q370",
    cpus: ["i5-9500t", "i7-9700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2666 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: "HP Flex IO module", vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "high", searchAliases: ["800 g5 mini", "elitedesk g5"],
    notes: ["Same three-drive layout as the G4 with 9th-gen CPUs."],
  }),
  m({
    slug: "hp-elitedesk-800-g6-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 800 G6 Mini", shortName: "EliteDesk 800 G6 Mini",
    released: 2020, chipset: "Q470",
    cpus: ["i5-10500t", "i7-10700t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 64, speedMTs: 2933 },
    storage: { m2Nvme: 2, sata25: 1 }, pcieSlot: "none",
    nic: "Intel I219-LM", extraNicOption: "HP Flex IO module", vpro: "some-skus", psuW: [65, 90],
    idleW: null, confidence: "check", searchAliases: ["800 g6 mini", "elitedesk g6"],
    notes: [],
  }),
  m({
    slug: "hp-prodesk-600-g3-mini",
    brand: "HP", family: "ProDesk Mini", name: "HP ProDesk 600 G3 Mini", shortName: "ProDesk 600 G3 Mini",
    released: 2017, chipset: null,
    cpus: ["i5-6500t", "i5-7500t"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2400 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: "no", psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["600 g3 mini", "prodesk g3"],
    notes: ["Frequently sold in 3-packs for Proxmox/K3s clusters in 2026."],
  }),
  m({
    slug: "hp-elitedesk-705-g4-mini",
    brand: "HP", family: "EliteDesk Mini", name: "HP EliteDesk 705 G4 Mini", shortName: "EliteDesk 705 G4 Mini",
    released: 2018, chipset: null,
    cpus: ["r5-2400ge"],
    ram: { slots: 2, type: "DDR4", maxOfficialGB: 32, speedMTs: 2666 },
    storage: { m2Nvme: 1, sata25: 1 }, pcieSlot: "none",
    nic: null, extraNicOption: null, vpro: null, psuW: [65],
    idleW: null, confidence: "check", searchAliases: ["705 g4 mini", "elitedesk 705"],
    notes: ["AMD APU variant of the EliteDesk Mini line."],
  }),
];

export function getModel(slug: string): Model | undefined {
  return MODELS.find((x) => x.slug === slug);
}
