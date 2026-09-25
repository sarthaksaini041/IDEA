"use client";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MARKETPLACES, type MarketplaceId } from "../lib/listings";
import { track } from "./analytics/track";

interface Option { slug: string; name: string }
type Errors = Record<string, string>;

export function AlertForm({ models }: { models: Option[] }) {
  const params = useSearchParams();
  const preset = models.some((m) => m.slug === params.get("model")) ? params.get("model")! : "";
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const clientErrors: Errors = {};
    if (!String(body.email).includes("@")) clientErrors.email = "Enter a valid email address.";
    if (!body.modelSlug) clientErrors.modelSlug = "Choose a model.";
    const p = Number(body.maxPrice);
    if (!Number.isFinite(p) || p < 20 || p > 5000) clientErrors.maxPrice = "Enter a price between 20 and 5000.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setState("sending");
    try {
      const res = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json().catch(() => ({}));
      if (res.status === 422 && j.errors) {
        setErrors(j.errors);
        setState("idle");
        return;
      }
      if (!res.ok) throw new Error(j.error || `Request failed (${res.status})`);
      setState("done");
      setMessage(j.emailSent ? "Check your inbox and click the confirmation link to activate the alert." : "Alert saved. Email delivery is not configured on this server yet, so no confirmation email was sent.");
      track("alert_created", { market: String(body.marketplace) });
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "done") return <p className="notice notice--ok" role="status">{message}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="panel" aria-describedby="alert-help">
      <div className="field">
        <label htmlFor="modelSlug">Model</label>
        <select id="modelSlug" name="modelSlug" defaultValue={preset} aria-invalid={!!errors.modelSlug} aria-describedby={errors.modelSlug ? "e-model" : undefined}>
          <option value="">Choose a model…</option>
          {models.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
        {errors.modelSlug && <p className="field-error" id="e-model">{errors.modelSlug}</p>}
      </div>
      <div className="two-col">
        <div className="field">
          <label htmlFor="marketplace">Marketplace</label>
          <select id="marketplace" name="marketplace" defaultValue="EBAY_US">
            {(Object.keys(MARKETPLACES) as MarketplaceId[]).map((id) => <option key={id} value={id}>{MARKETPLACES[id].label} ({MARKETPLACES[id].currency})</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="maxPrice">Maximum price</label>
          <input id="maxPrice" name="maxPrice" type="number" inputMode="numeric" min={20} max={5000} step={1} placeholder="e.g. 150" aria-invalid={!!errors.maxPrice} aria-describedby={errors.maxPrice ? "e-price" : undefined} />
          {errors.maxPrice && <p className="field-error" id="e-price">{errors.maxPrice}</p>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
        {errors.email && <p className="field-error" id="e-email">{errors.email}</p>}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {state === "error" && <p className="notice notice--err" role="alert">{message}</p>}
      {errors.form && <p className="notice notice--err" role="alert">{errors.form}</p>}
      <button className="btn btn--primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Saving…" : "Create alert"}
      </button>
      <p id="alert-help" className="small muted">We email you at most once a day per alert, only when a fixed-price listing matches. One click unsubscribes. We never share your email.</p>
    </form>
  );
}
