import { CPUS, type Cpu, type IgpuFamily } from "../data/cpus";
import { MODELS, type Model } from "../data/models";
import { MEDIA, transcodeVerdict, type TranscodeVerdict } from "./media";

export interface ModelView extends Model {
  cpuList: Cpu[];
  minGen: number;
  maxGen: number;
  maxThreads: number;
  vendor: "Intel" | "AMD";
  /** iGPU family of the newest CPU option: what a buyer can get by picking the right listing. */
  bestIgpu: IgpuFamily;
  verdict: TranscodeVerdict;
  hevc10: boolean;
  av1: boolean;
  totalDrives: number;
}

const FAMILY_RANK: IgpuFamily[] = ["intel-gen9", "amd-vcn1", "intel-gen9.5", "amd-vcn2", "intel-xe"];

export function view(model: Model): ModelView {
  const cpuList = model.cpus.map((id) => {
    const c = CPUS[id];
    if (!c) throw new Error(`Model ${model.slug} references unknown CPU ${id}`);
    return c;
  });
  const bestIgpu = cpuList
    .map((c) => c.igpuFamily)
    .sort((a, b) => FAMILY_RANK.indexOf(b) - FAMILY_RANK.indexOf(a))[0];
  const caps = MEDIA[bestIgpu];
  return {
    ...model,
    cpuList,
    minGen: Math.min(...cpuList.map((c) => c.genNumber)),
    maxGen: Math.max(...cpuList.map((c) => c.genNumber)),
    maxThreads: Math.max(...cpuList.map((c) => c.threads)),
    vendor: cpuList[0].vendor,
    bestIgpu,
    verdict: transcodeVerdict(bestIgpu),
    hevc10: caps.decode.hevc10,
    av1: caps.decode.av1,
    totalDrives: model.storage.m2Nvme + model.storage.sata25,
  };
}

export const CATALOG: ModelView[] = MODELS.map(view).sort(
  (a, b) => a.brand.localeCompare(b.brand) || a.released - b.released || a.shortName.localeCompare(b.shortName),
);

export function getView(slug: string): ModelView | undefined {
  return CATALOG.find((x) => x.slug === slug);
}

/** Models a buyer would plausibly cross-shop: same era, different brand first. */
export function alternatives(v: ModelView, n = 3): ModelView[] {
  return CATALOG.filter((x) => x.slug !== v.slug)
    .map((x) => ({ x, score: Math.abs(x.maxGen - v.maxGen) * 2 + (x.brand === v.brand ? 1 : 0) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((s) => s.x);
}

export function pcieLabel(p: Model["pcieSlot"]): string {
  return { none: "None", "riser-x8": "PCIe x8 via riser", riser: "Riser expansion", "gpu-option": "PCIe (dGPU option)" }[p];
}

export function genRange(v: ModelView): string {
  const gens = [...new Set(v.cpuList.map((c) => c.generation))];
  return gens.join(" / ");
}

/** Lowest sourced idle reading, or null. Never estimated. */
export function measuredIdle(m: Model): { idleW: number; label: string; source: { label: string; url: string } } | null {
  const recs = [...(m.power ?? [])].sort((a, b) => a.idleW - b.idleW);
  const r = recs[0];
  return r ? { idleW: r.idleW, label: r.idleMaxW ? `${r.idleW}–${r.idleMaxW} W` : `about ${r.idleW} W`, source: r.source } : null;
}

export const hasLan = (m: Model, speed: "2.5GbE" | "10GbE") => (m.lanUpgrades ?? []).some((u) => u.speed === speed);
/** 10GbE implies a path that also handles 2.5GbE cards. */
export const fasterThanGigabit = (m: Model) => (m.lanUpgrades ?? []).length > 0;

export function networkingLabel(m: Model): string {
  const up = m.lanUpgrades ?? [];
  if (!up.length) return m.extraNicOption ? `1 GbE onboard; ${m.extraNicOption}` : "1 GbE onboard; USB adapter for more";
  return up.map((u) => `${u.speed} via ${u.via}${u.basis === "community" ? " (owner-reported, not a vendor option)" : ""}`).join("; ");
}

export function idleLabel(m: Model): string {
  const r = measuredIdle(m);
  return r ? `${r.label} at the wall (${r.source.label.replace(/:.*/, "")}, ${m.power?.[0]?.config})` : "Not measured yet";
}

/** The newest CPU option sold in the chassis (highest generation, then most threads). */
export function newestCpu(m: ModelView) {
  return [...m.cpuList].sort((a, b) => b.genNumber - a.genNumber || b.threads - a.threads)[0];
}
