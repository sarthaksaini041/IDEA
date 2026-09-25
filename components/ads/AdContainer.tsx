import type { ReactNode } from "react";
import type { PlacementConfig } from "./AdConfig";

/** Visually separated, clearly labelled wrapper that reserves space for an ad. */
export function AdContainer({ config, children }: { config: PlacementConfig; children: ReactNode }) {
  return (
    <aside
      className={`ad ${config.desktopOnly ? "ad--desktop" : ""}`}
      aria-label="Advertisement"
      style={
        {
          "--ad-min-m": `${config.minHeight.mobile}px`,
          "--ad-min-d": `${config.minHeight.desktop}px`,
        } as React.CSSProperties
      }
    >
      <span className="ad__label">Advertisement</span>
      <div className="ad__body">{children}</div>
    </aside>
  );
}
