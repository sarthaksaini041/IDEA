import { AD_PROVIDER, ADSENSE_CLIENT, PLACEMENTS, adsEnabled, type Placement } from "./AdConfig";
import { AdContainer } from "./AdContainer";
import { ResponsiveAd } from "./ResponsiveAd";

/**
 * The only component pages use to show ads. Renders nothing when ads are disabled
 * or a placement has no slot configured, so there are never empty ad boxes.
 */
export function AdSlot({ placement }: { placement: Placement }) {
  if (!adsEnabled()) return null;
  const config = PLACEMENTS[placement];

  if (AD_PROVIDER === "placeholder") {
    return (
      <AdContainer config={config}>
        <div className="ad__placeholder">Ad placeholder · {placement}</div>
      </AdContainer>
    );
  }
  if (AD_PROVIDER === "adsense" && config.adsenseSlot) {
    return (
      <AdContainer config={config}>
        <ResponsiveAd client={ADSENSE_CLIENT} slot={config.adsenseSlot} format={config.format} />
      </AdContainer>
    );
  }
  return null;
}
