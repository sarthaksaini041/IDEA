// Curated head-to-head pages. Only pairs people actually cross-shop (seen repeatedly in
// r/homelab, r/HomeServer and r/Proxmox threads 2025–2026). Do not mass-generate pairs.
export interface Comparison { slug: string; a: string; b: string; title: string; question: string }

const c = (a: string, b: string, aName: string, bName: string, question: string): Comparison => ({
  slug: `${a.replace(/^(lenovo-thinkcentre|dell-optiplex|hp)-/, "")}-vs-${b.replace(/^(lenovo-thinkcentre|dell-optiplex|hp)-/, "")}`,
  a, b, title: `${aName} vs ${bName}`, question,
});

export const COMPARISONS: Comparison[] = [
  c("lenovo-thinkcentre-m720q", "lenovo-thinkcentre-m920q", "M720q", "M920q", "Is the M920q worth paying more than the M720q?"),
  c("lenovo-thinkcentre-m920q", "lenovo-thinkcentre-m920x", "M920q", "M920x", "Which one has two NVMe slots?"),
  c("lenovo-thinkcentre-m920q", "hp-elitedesk-800-g4-mini", "M920q", "EliteDesk 800 G4 Mini", "Which is the better Proxmox node?"),
  c("hp-elitedesk-800-g4-mini", "dell-optiplex-7060-micro", "EliteDesk 800 G4 Mini", "OptiPlex 7060 Micro", "HP EliteDesk or Dell OptiPlex?"),
  c("hp-elitedesk-800-g3-mini", "dell-optiplex-7050-micro", "EliteDesk 800 G3 Mini", "OptiPlex 7050 Micro", "Which 7th-gen box for a first home server?"),
  c("lenovo-thinkcentre-m720q", "dell-optiplex-3080-micro", "M720q", "OptiPlex 3080 Micro", "PCIe riser or newer 10th-gen CPU?"),
];
