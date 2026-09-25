import { CATALOG, fasterThanGigabit, hasLan, type ModelView } from "./catalog";

// "Which mini PC is right for me?" Every answer maps to a yes/no rule over the spec data.
// No weighted scores: a model either meets a requirement or it does not, and the result
// lists exactly which rules it met (or the single one it missed).
export interface Answers {
  use: "general" | "proxmox" | "media" | "router" | "storage";
  ram: 16 | 32 | 64;
  drives: 1 | 2 | 3;
  network: "1g" | "second-port" | "2.5g" | "10g";
  media: "none" | "hevc" | "av1";
  priority: "cost" | "newest";
}

export const DEFAULT_ANSWERS: Answers = { use: "general", ram: 16, drives: 1, network: "1g", media: "none", priority: "cost" };

interface Rule { label: string; test: (m: ModelView) => boolean }

export function rulesFor(a: Answers): Rule[] {
  const r: Rule[] = [];
  if (a.use === "proxmox") r.push({ label: "6+ CPU threads for several VMs", test: (m) => m.maxThreads >= 6 });
  if (a.use === "media" && a.media === "none") r.push({ label: "Hardware 4K HEVC decode (Intel Quick Sync)", test: (m) => m.hevc10 && m.vendor === "Intel" });
  if (a.use === "router") r.push({ label: "Internal second network port option (PCIe or vendor module)", test: (m) => m.pcieSlot !== "none" || m.extraNicOption !== null });
  if (a.use === "storage") r.push({ label: "At least 2 internal drives", test: (m) => m.totalDrives >= 2 });
  if (a.ram > 16) r.push({ label: `${a.ram} GB RAM officially supported`, test: (m) => m.ram.maxOfficialGB >= a.ram });
  if (a.drives > 1) r.push({ label: `${a.drives}+ internal drives`, test: (m) => m.totalDrives >= a.drives });
  if (a.network === "second-port") r.push({ label: "Internal second network port option", test: (m) => m.pcieSlot !== "none" || m.extraNicOption !== null });
  if (a.network === "2.5g") r.push({ label: "2.5GbE or faster without USB", test: fasterThanGigabit });
  if (a.network === "10g") r.push({ label: "10GbE via a PCIe card", test: (m) => hasLan(m, "10GbE") });
  if (a.media === "hevc") r.push({ label: "Hardware 10-bit HEVC decode", test: (m) => m.hevc10 });
  if (a.media === "av1") r.push({ label: "Hardware AV1 decode", test: (m) => m.av1 });
  return r;
}

export interface Result { model: ModelView; met: string[]; missed: string[] }

export function recommend(a: Answers, catalog: ModelView[] = CATALOG): { matches: Result[]; nearMisses: Result[]; rules: string[] } {
  const rules = rulesFor(a);
  const scored = catalog.map((model) => ({
    model,
    met: rules.filter((r) => r.test(model)).map((r) => r.label),
    missed: rules.filter((r) => !r.test(model)).map((r) => r.label),
  }));
  const order = (x: Result, y: Result) =>
    a.priority === "cost"
      ? x.model.released - y.model.released || x.model.maxGen - y.model.maxGen
      : y.model.maxGen - x.model.maxGen || y.model.released - x.model.released;
  return {
    rules: rules.map((r) => r.label),
    matches: scored.filter((s) => s.missed.length === 0).sort(order),
    nearMisses: scored.filter((s) => s.missed.length === 1).sort(order).slice(0, 4),
  };
}
