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
