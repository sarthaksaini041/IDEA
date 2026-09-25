"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorsFrom, postJson } from "./api";

export interface AlertView { id: string; modelName: string; modelSlug: string; maxPrice: number; market: string; currency: string }

export function AlertList({ alerts }: { alerts: AlertView[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(id: string) {
    setBusy(id);
    setError("");
    const r = await postJson("/api/alerts/delete", { id });
    setBusy(null);
    if (r.data.ok) router.refresh();
    else setError(errorsFrom(r).form ?? "Could not delete the alert.");
  }

  if (!alerts.length) {
    return (
      <div className="empty">
        <p><strong>No price alerts yet.</strong></p>
        <p className="muted">Pick a model and a target price, and we&apos;ll email you when a listing matches.</p>
        <Link className="btn btn--primary" href="/alerts">Create an alert</Link>
      </div>
    );
  }
  return (
    <>
      {error && <p className="notice notice--err" role="alert">{error}</p>}
      <ul className="alert-list">
        {alerts.map((a) => (
          <li key={a.id} className="card alert-item">
            <span>
              <Link href={`/models/${a.modelSlug}`}><strong>{a.modelName}</strong></Link>
              <span className="muted small"> · under {a.currency} {a.maxPrice} · {a.market}</span>
            </span>
            <button className="btn" onClick={() => remove(a.id)} disabled={busy === a.id} aria-label={`Delete alert for ${a.modelName}`}>
              {busy === a.id ? "Deleting…" : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await postJson("/api/auth/logout", {});
        router.replace("/");
        router.refresh();
      }}
    >
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}
