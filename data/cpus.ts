// CPU reference data for processors commonly found in used 1-litre business PCs.
// Media-engine capabilities are derived from the iGPU generation (see lib/media.ts),
// not stored per CPU, so a correction to one generation fixes every CPU that uses it.

export type IgpuFamily =
  | "intel-gen9" // Skylake (6th gen): HD 5xx
  | "intel-gen9.5" // Kaby Lake / Coffee Lake / Comet Lake (7th–10th gen): HD/UHD 6xx
  | "intel-xe" // Xe-LP graphics: Rocket Lake (11th gen) and Alder / Raptor Lake (12th–13th gen): UHD 7xx
  | "amd-vcn1" // Raven Ridge / Picasso (Ryzen 2000/3000 APUs)
  | "amd-vcn2"; // Renoir (Ryzen 4000 APUs)

export interface Cpu {
  id: string;
  name: string;
  vendor: "Intel" | "AMD";
  generation: string; // human label, e.g. "8th gen (Coffee Lake)"
  genNumber: number; // sortable: Intel core generation, AMD mapped to rough era
  cores: number;
  threads: number;
  tdpW: number;
  igpu: string;
  igpuFamily: IgpuFamily;
}

const cpu = (c: Cpu) => c;

export const CPUS: Record<string, Cpu> = Object.fromEntries(
  [
    cpu({ id: "i3-6100t", name: "Core i3-6100T", vendor: "Intel", generation: "6th gen (Skylake)", genNumber: 6, cores: 2, threads: 4, tdpW: 35, igpu: "HD 530", igpuFamily: "intel-gen9" }),
    cpu({ id: "i5-6500t", name: "Core i5-6500T", vendor: "Intel", generation: "6th gen (Skylake)", genNumber: 6, cores: 4, threads: 4, tdpW: 35, igpu: "HD 530", igpuFamily: "intel-gen9" }),
    cpu({ id: "i7-6700t", name: "Core i7-6700T", vendor: "Intel", generation: "6th gen (Skylake)", genNumber: 6, cores: 4, threads: 8, tdpW: 35, igpu: "HD 530", igpuFamily: "intel-gen9" }),
    cpu({ id: "i3-7100t", name: "Core i3-7100T", vendor: "Intel", generation: "7th gen (Kaby Lake)", genNumber: 7, cores: 2, threads: 4, tdpW: 35, igpu: "HD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i5-7500t", name: "Core i5-7500T", vendor: "Intel", generation: "7th gen (Kaby Lake)", genNumber: 7, cores: 4, threads: 4, tdpW: 35, igpu: "HD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i7-7700t", name: "Core i7-7700T", vendor: "Intel", generation: "7th gen (Kaby Lake)", genNumber: 7, cores: 4, threads: 8, tdpW: 35, igpu: "HD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i3-8100t", name: "Core i3-8100T", vendor: "Intel", generation: "8th gen (Coffee Lake)", genNumber: 8, cores: 4, threads: 4, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i5-8500t", name: "Core i5-8500T", vendor: "Intel", generation: "8th gen (Coffee Lake)", genNumber: 8, cores: 6, threads: 6, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i7-8700t", name: "Core i7-8700T", vendor: "Intel", generation: "8th gen (Coffee Lake)", genNumber: 8, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i3-9100t", name: "Core i3-9100T", vendor: "Intel", generation: "9th gen (Coffee Lake Refresh)", genNumber: 9, cores: 4, threads: 4, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i5-9500t", name: "Core i5-9500T", vendor: "Intel", generation: "9th gen (Coffee Lake Refresh)", genNumber: 9, cores: 6, threads: 6, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i7-9700t", name: "Core i7-9700T", vendor: "Intel", generation: "9th gen (Coffee Lake Refresh)", genNumber: 9, cores: 8, threads: 8, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i3-10100t", name: "Core i3-10100T", vendor: "Intel", generation: "10th gen (Comet Lake)", genNumber: 10, cores: 4, threads: 8, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i5-10500t", name: "Core i5-10500T", vendor: "Intel", generation: "10th gen (Comet Lake)", genNumber: 10, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i7-10700t", name: "Core i7-10700T", vendor: "Intel", generation: "10th gen (Comet Lake)", genNumber: 10, cores: 8, threads: 16, tdpW: 35, igpu: "UHD 630", igpuFamily: "intel-gen9.5" }),
    cpu({ id: "i5-11400t", name: "Core i5-11400T", vendor: "Intel", generation: "11th gen (Rocket Lake)", genNumber: 11, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 730", igpuFamily: "intel-xe" }),
    cpu({ id: "i5-11500t", name: "Core i5-11500T", vendor: "Intel", generation: "11th gen (Rocket Lake)", genNumber: 11, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 750", igpuFamily: "intel-xe" }),
    cpu({ id: "i5-11600t", name: "Core i5-11600T", vendor: "Intel", generation: "11th gen (Rocket Lake)", genNumber: 11, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 750", igpuFamily: "intel-xe" }),
    cpu({ id: "i3-12100t", name: "Core i3-12100T", vendor: "Intel", generation: "12th gen (Alder Lake)", genNumber: 12, cores: 4, threads: 8, tdpW: 35, igpu: "UHD 730", igpuFamily: "intel-xe" }),
    cpu({ id: "i5-12500t", name: "Core i5-12500T", vendor: "Intel", generation: "12th gen (Alder Lake)", genNumber: 12, cores: 6, threads: 12, tdpW: 35, igpu: "UHD 770", igpuFamily: "intel-xe" }),
    cpu({ id: "i7-12700t", name: "Core i7-12700T", vendor: "Intel", generation: "12th gen (Alder Lake)", genNumber: 12, cores: 12, threads: 20, tdpW: 35, igpu: "UHD 770", igpuFamily: "intel-xe" }),
    cpu({ id: "i5-13500t", name: "Core i5-13500T", vendor: "Intel", generation: "13th gen (Raptor Lake)", genNumber: 13, cores: 14, threads: 20, tdpW: 35, igpu: "UHD 770", igpuFamily: "intel-xe" }),
    cpu({ id: "r5-2400ge", name: "Ryzen 5 PRO 2400GE", vendor: "AMD", generation: "Ryzen 2000 (Raven Ridge)", genNumber: 8, cores: 4, threads: 8, tdpW: 35, igpu: "Radeon Vega 11", igpuFamily: "amd-vcn1" }),
    cpu({ id: "r5-3400ge", name: "Ryzen 5 PRO 3400GE", vendor: "AMD", generation: "Ryzen 3000 (Picasso)", genNumber: 9, cores: 4, threads: 8, tdpW: 35, igpu: "Radeon Vega 11", igpuFamily: "amd-vcn1" }),
    cpu({ id: "r5-4650ge", name: "Ryzen 5 PRO 4650GE", vendor: "AMD", generation: "Ryzen 4000 (Renoir)", genNumber: 10, cores: 6, threads: 12, tdpW: 35, igpu: "Radeon Vega 7", igpuFamily: "amd-vcn2" }),
    cpu({ id: "r7-4750ge", name: "Ryzen 7 PRO 4750GE", vendor: "AMD", generation: "Ryzen 4000 (Renoir)", genNumber: 10, cores: 8, threads: 16, tdpW: 35, igpu: "Radeon Vega 8", igpuFamily: "amd-vcn2" }),
  ].map((c) => [c.id, c]),
);

export function getCpu(id: string): Cpu {
  const c = CPUS[id];
  if (!c) throw new Error(`Unknown CPU id: ${id}`);
  return c;
}
