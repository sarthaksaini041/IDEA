// Feature-usage events. No personal data: event names and small enums/counts only.
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void;
    umami?: { track: (event: string, props?: Props) => void };
  }
}

export type EventName =
  | "filter_change"
  | "compare_add"
  | "compare_view"
  | "listing_click"
  | "alert_created"
  | "correction_click";

export function track(event: EventName, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.umami?.track(event, props);
  } catch {
    // analytics must never break the UI
  }
}
