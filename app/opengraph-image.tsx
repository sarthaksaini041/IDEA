import { ImageResponse } from "next/og";
import { SITE } from "../lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.tagline;

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#f5f3ee", color: "#1b1e23" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36, fontWeight: 700 }}>
          <div style={{ width: 70, height: 44, border: "6px solid #1b1e23", borderRadius: 8, display: "flex", justifyContent: "flex-end", alignItems: "center", padding: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#b4410f" }} />
          </div>
          {SITE.name}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 40, lineHeight: 1.1 }}>{SITE.tagline}</div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#5a6170" }}>ThinkCentre Tiny · OptiPlex Micro · EliteDesk Mini</div>
      </div>
    ),
    size,
  );
}
