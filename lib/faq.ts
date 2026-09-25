import { newestCpu, hasLan, measuredIdle, pcieLabel, type ModelView } from "./catalog";
import { MEDIA } from "./media";

export interface Faq { q: string; a: string }

// Model FAQs generated from the spec data, so every answer is traceable to a field and
// updates when the data does. Unofficial facts are labelled as such.
export function modelFaqs(m: ModelView): Faq[] {
  const f: Faq[] = [];
  const unofficial64 = m.ram.maxOfficialGB < 64 && m.notes.find((n) => /64 GB/.test(n));
  f.push({
    q: `How much RAM does the ${m.shortName} support?`,
    a: `${m.brand}'s official maximum is ${m.ram.maxOfficialGB} GB across ${m.ram.slots} ${m.ram.type} SODIMM slots at up to ${m.ram.speedMTs} MT/s.${unofficial64 ? ` ${unofficial64}` : ""}`,
  });
  f.push({
    q: `How many NVMe SSDs can the ${m.shortName} hold?`,
    a: `${m.storage.m2Nvme} M.2 NVMe ${m.storage.m2Nvme === 1 ? "slot" : "slots"} for storage plus ${m.storage.sata25} 2.5" SATA ${m.storage.sata25 === 1 ? "bay" : "bays"}, so up to ${m.totalDrives} internal drives.`,
  });
  f.push({
    q: `Does the ${m.shortName} have a PCIe slot?`,
    a: m.pcieSlot === "none" ? `No. It has no internal PCIe slot${m.extraNicOption ? `; the only internal expansion is ${m.extraNicOption}` : ""}.` : `Yes: ${pcieLabel(m.pcieSlot)}. ${m.extraNicOption ?? ""}`.trim(),
  });
  f.push({
    q: `Can the ${m.shortName} use 10GbE or 2.5GbE networking?`,
    a: hasLan(m, "10GbE") || hasLan(m, "2.5GbE")
      ? (m.lanUpgrades ?? []).map((u) => `${u.speed} via ${u.via}${u.basis === "community" ? " (reported by owners, not a vendor option)" : " (manufacturer option)"}`).join(". ") + "."
      : `Not internally. It has ${m.nic ? `a 1 GbE ${m.nic}` : "1 GbE onboard"}; faster networking needs a USB adapter.`,
  });
  const best = newestCpu(m);
  f.push({
    q: `Is the ${m.shortName} good for Plex or Jellyfin?`,
    a: `${MEDIA[m.bestIgpu].note} That applies to the best CPU option (${best.name}, ${best.igpu}); check which CPU a listing has.`,
  });
  const idle = measuredIdle(m);
  f.push({
    q: `How much power does the ${m.shortName} use at idle?`,
    a: idle ? `${idle.label} at the wall at idle, as measured by ${idle.source.label.replace(/:.*/, "")} (${m.power?.[0]?.config}, 120 V). Your drives, BIOS settings and OS will change this figure.` : "We have not published a sourced measurement for this model yet, and we do not estimate one. Idle draw depends on CPU, drives, BIOS power settings and OS.",
  });
  return f;
}
