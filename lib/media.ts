import type { IgpuFamily } from "../data/cpus";

// Hardware video engine capabilities per iGPU family. This is the single place these
// facts live; model pages and filters derive from it.
export interface MediaCaps {
  label: string;
  decode: { h264: boolean; hevc8: boolean; hevc10: boolean; vp9: boolean; av1: boolean };
  encode: { h264: boolean; hevc: boolean; av1: boolean };
  note: string;
}

export const MEDIA: Record<IgpuFamily, MediaCaps> = {
  "intel-gen9": {
    label: "Intel Quick Sync (Skylake)",
    decode: { h264: true, hevc8: true, hevc10: false, vp9: false, av1: false },
    encode: { h264: true, hevc: true, av1: false },
    note: "No full hardware decode for 10-bit HEVC, which is the format most 4K HDR files use. Fine for 1080p H.264 libraries.",
  },
  "intel-gen9.5": {
    label: "Intel Quick Sync (Kaby Lake–Comet Lake)",
    decode: { h264: true, hevc8: true, hevc10: true, vp9: true, av1: false },
    encode: { h264: true, hevc: true, av1: false },
    note: "Handles 10-bit HEVC (typical 4K HDR) in hardware. No AV1 decode, so AV1 files fall back to the CPU.",
  },
  "intel-xe": {
    label: "Intel Quick Sync (Xe, 11th–13th gen)",
    decode: { h264: true, hevc8: true, hevc10: true, vp9: true, av1: true },
    encode: { h264: true, hevc: true, av1: false },
    note: "Adds AV1 hardware decode. The most future-proof option in this list for media servers.",
  },
  "amd-vcn1": {
    label: "AMD VCN 1.0",
    decode: { h264: true, hevc8: true, hevc10: true, vp9: true, av1: false },
    encode: { h264: true, hevc: true, av1: false },
    note: "Works with Jellyfin via VA-API, but AMD's encoder quality and media-server support lag Intel Quick Sync.",
  },
  "amd-vcn2": {
    label: "AMD VCN 2.0",
    decode: { h264: true, hevc8: true, hevc10: true, vp9: true, av1: false },
    encode: { h264: true, hevc: true, av1: false },
    note: "Works with Jellyfin via VA-API, but AMD's encoder quality and media-server support lag Intel Quick Sync.",
  },
};

export type TranscodeVerdict = "great" | "good" | "amd" | "limited";

/** Short, conservative verdict for Plex/Jellyfin hardware transcoding. */
export function transcodeVerdict(family: IgpuFamily): TranscodeVerdict {
  if (family === "intel-xe") return "great";
  if (family === "intel-gen9.5") return "good";
  if (family.startsWith("amd")) return "amd";
  return "limited";
}

export const VERDICT_TEXT: Record<TranscodeVerdict, string> = {
  great: "Great for 4K HDR and AV1 libraries",
  good: "Good for 4K HEVC; no AV1 decode",
  amd: "Works in Jellyfin; Intel is the safer media-server pick",
  limited: "Limited: 1080p H.264 is fine, 4K HDR is not",
};
