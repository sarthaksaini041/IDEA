import type { Metadata } from "next";
import { Suspense } from "react";
import { Unsubscribe } from "../../../components/Unsubscribe";

export const metadata: Metadata = { title: "Unsubscribe from a price alert", robots: { index: false, follow: false } };

export default function UnsubscribePage() {
  return (
    <div className="prose">
      <h1>Unsubscribe</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Unsubscribe />
      </Suspense>
    </div>
  );
}
