import type { PowerRecord } from "./models";

// Idle power measurements, each with its original source.
//
// Imported (2026-09-25) from the SolvoHQ "homelab-mini-pc-dataset", licensed CC BY 4.0
// (https://github.com/SolvoHQ/homelab-mini-pc-dataset), which cites each value to its
// original review. Only values marked measured=true AND taken from a primary review are
// included. Excluded on purpose: editorial estimates, buyer's-guide aggregates, and configs
// that would mislead for the chassis (discrete-GPU M920x, 65 W-CPU OptiPlex 7060).
// All are 120 V wall-meter readings by ServeTheHome; we have not re-measured them.
const VIA = { label: "homelab-mini-pc-dataset (CC BY 4.0)", url: "https://github.com/SolvoHQ/homelab-mini-pc-dataset" };
const STH = "Wall meter at 120 V, idle (ServeTheHome test setup)";

const r = (idle: number, max: number | undefined, config: string, label: string, url: string, date: string, loadW?: number): PowerRecord => ({
  kind: "third-party", idleW: idle, ...(max ? { idleMaxW: max } : {}), ...(loadW ? { loadW } : {}),
  config, method: STH, measuredOn: date, source: { label, url }, via: VIA,
});

export const POWER: Record<string, PowerRecord[]> = {
  "lenovo-thinkcentre-m710q": [r(11, 13, "Quad-core Core i5-7500T", "ServeTheHome: Lenovo ThinkCentre M710q Tiny guide & review", "https://www.servethehome.com/lenovo-thinkcentre-m710q-tiny-guide-and-ce-review/3/", "2021")],
  "lenovo-thinkcentre-m720q": [r(11, 14, "Dual-core Pentium Gold G5400T (an i5-8500T config draws somewhat more)", "ServeTheHome: Lenovo ThinkCentre M720q TinyMiniMicro feature", "https://www.servethehome.com/lenovo-thinkcentre-m720q-tinyminimicro-feature/3/", "2020-09-05")],
  "lenovo-thinkcentre-m920q": [r(12, 15, "Quad/six-core 8th-gen T-series CPU", "ServeTheHome: Lenovo ThinkCentre M920/M920q Tiny guide & review", "https://www.servethehome.com/lenovo-thinkcentre-m920-and-m920q-tiny-guide-and-review/3/", "2021")],
  "lenovo-thinkcentre-m75q-gen-1": [r(11, undefined, "Ryzen 5 PRO 3400GE", "ServeTheHome: Lenovo ThinkCentre M75q-1 Tiny review", "https://www.servethehome.com/lenovo-thinkcentre-m75q-1-tiny-review-project-tinyminimicro/4/", "2020")],
  "lenovo-thinkcentre-m75q-gen-2": [r(12, undefined, "Ryzen PRO 4000-series APU", "ServeTheHome: Lenovo ThinkCentre M75q Gen2 Tiny review", "https://www.servethehome.com/lenovo-thinkcentre-m75q-gen2-tiny-review-amd-changes-the-game/4/", "2021")],
  "dell-optiplex-3050-micro": [r(11, 14, "Quad-core Core i5-7500T", "ServeTheHome: Dell OptiPlex 3050 Micro TinyMiniMicro guide", "https://www.servethehome.com/dell-optiplex-3050-micro-project-tinyminimicro-guide-review/3/", "2021")],
  "dell-optiplex-7070-micro": [r(13, undefined, "Six-core Core i5-9500T (\"just over 13 W\")", "ServeTheHome: Dell OptiPlex 7070 Micro TinyMiniMicro guide & review", "https://www.servethehome.com/dell-optiplex-7070-micro-project-tinyminimicro-guide-and-review/3/", "2021")],
  "hp-elitedesk-800-g2-mini": [r(11, 14, "Quad-core Core i5-6500T", "ServeTheHome: HP EliteDesk 800 G2 Mini TinyMiniMicro review", "https://www.servethehome.com/hp-elitedesk-800-g2-mini-project-tinyminimicro-ce-review/3/", "2021")],
  "hp-elitedesk-800-g3-mini": [r(12, undefined, "Quad-core Core i5-7500T, 65 W adapter", "ServeTheHome: HP EliteDesk 800 G3 Mini TinyMiniMicro review", "https://www.servethehome.com/hp-elitedesk-800-g3-mini-ce-review-project-tinyminimicro/4/", "2021", 51)],
  "hp-elitedesk-800-g4-mini": [r(11, 12, "Six-core Core i5-8500T", "ServeTheHome: HP EliteDesk 800 G4 Mini TinyMiniMicro guide & review", "https://www.servethehome.com/hp-elitedesk-800-g4-mini-tinyminimicro-guide-review/3/", "2020-10-18")],
  "hp-elitedesk-705-g4-mini": [r(11, 14, "Quad-core Ryzen PRO APU", "ServeTheHome: HP EliteDesk 705 G4 Mini TinyMiniMicro review", "https://www.servethehome.com/hp-elitedesk-705-g4-mini-amd-ryzen-based-project-tinyminimicro/3/", "2020-09-13")],
};
