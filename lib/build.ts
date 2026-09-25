import type { Model } from "../data/models";
import { amazonSearchUrl } from "./affiliate/amazon";

// "What to buy with it": the parts a model needs to become a home server, derived from its
// spec data so compatibility is explicit. No prices are shown for parts (Amazon forbids
// showing its prices without its API, and we will not invent any).
export interface BuildItem {
  id: string;
  label: string;
  /** Exact spec to look for. */
  spec: string;
  /** Why it fits this model. */
  compatibility: string;
  /** Search keywords used for a retailer link when an affiliate program is configured. */
  keywords: string;
  optional?: boolean;
}

export function buildList(m: Model): BuildItem[] {
  const items: BuildItem[] = [];
  const perStick = m.ram.maxOfficialGB / m.ram.slots;
  items.push({
    id: "ram",
    label: `${m.ram.maxOfficialGB} GB RAM kit`,
    spec: `${m.ram.slots} × ${perStick} GB ${m.ram.type} SODIMM, ${m.ram.speedMTs} MT/s or faster (runs at ${m.ram.speedMTs})`,
    compatibility: `${m.ram.slots} SODIMM slots, ${m.ram.maxOfficialGB} GB official maximum. ${m.ram.type === "DDR5" ? "DDR5 only: DDR4 modules do not fit." : "DDR4 laptop-size modules (not desktop DIMMs, not DDR5)."}`,
    keywords: `${m.ram.slots * perStick}GB (${m.ram.slots}x${perStick}GB) ${m.ram.type} ${m.ram.speedMTs} SODIMM`,
  });
  items.push({
    id: "nvme",
    label: m.storage.m2Nvme > 1 ? `${m.storage.m2Nvme} × NVMe SSD` : "NVMe SSD",
    spec: "M.2 2280 NVMe SSD (PCIe), e.g. 1 TB with DRAM cache or HMB for VM storage",
    compatibility: `${m.storage.m2Nvme} M.2 2280 storage ${m.storage.m2Nvme === 1 ? "slot" : "slots"}.${m.storage.m2Nvme > 1 ? " Two drives allow a ZFS mirror or separate boot and VM storage." : ""}`,
    keywords: "1TB M.2 2280 NVMe SSD",
  });
  if (m.storage.sata25 > 0) {
    items.push({
      id: "sata",
      label: '2.5" SATA SSD + caddy',
      spec: '2.5" SATA SSD (7 mm), plus the model\'s drive caddy/cable if the unit did not ship with one',
      compatibility: `${m.storage.sata25} × 2.5" bay.${m.pcieSlot !== "none" ? " Not usable at the same time as a PCIe riser card in this chassis." : ""}`,
      keywords: '1TB 2.5" SATA SSD',
      optional: true,
    });
  }
  const tenGbe = (m.lanUpgrades ?? []).find((u) => u.speed === "10GbE");
  if (tenGbe) {
    items.push({
      id: "nic",
      label: "10GbE network card + riser",
      spec: "Low-profile PCIe 10GbE NIC (Intel X520/X710 or Mellanox ConnectX-3/4 are common picks) and the model-specific riser + bracket",
      compatibility: `${tenGbe.via}.${tenGbe.basis === "community" ? " Owner-reported, not a vendor-listed option: check card height and cooling." : ""}`,
      keywords: "low profile 10GbE SFP+ PCIe network card",
      optional: true,
    });
  } else if (m.extraNicOption) {
    items.push({
      id: "nic",
      label: "Second network port",
      spec: m.extraNicOption,
      compatibility: "Vendor module: match the exact module version to this generation before buying.",
      keywords: `${m.brand} ${m.family} network module`,
      optional: true,
    });
  } else {
    items.push({
      id: "nic",
      label: "USB 2.5GbE adapter (optional)",
      spec: "USB 3 (5 Gbps) 2.5GbE adapter",
      compatibility: "No internal slot for a second network port; a USB adapter is the only option.",
      keywords: "USB 3 2.5GbE Ethernet adapter",
      optional: true,
    });
  }
  if (m.psuW) {
    items.push({
      id: "psu",
      label: "Power adapter (if missing)",
      spec: `${m.brand} ${m.psuW.join(" W or ")} W adapter with the correct connector`,
      compatibility: "Many ex-office units are sold without one. Use the wattage the manufacturer lists for the CPU fitted.",
      keywords: `${m.brand} ${m.psuW.at(-1)}W power adapter ${m.family}`,
      optional: true,
    });
  }
  return items;
}

export const itemLink = (item: BuildItem): string | null => amazonSearchUrl(item.keywords);
