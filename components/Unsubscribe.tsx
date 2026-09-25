"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function Unsubscribe() {
  const token = useSearchParams().get("token") || "";
  const [state, setState] = useState<"idle" | "busy" | "done" | "missing" | "error">(token ? "idle" : "missing");

  async function go() {
    setState("busy");
    try {
      const res = await fetch("/api/alerts/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const j = await res.json();
      setState(res.ok ? (j.removed ? "done" : "missing") : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p className="notice notice--ok" role="status">Done. That alert is deleted and you will not get more emails for it.</p>;
  if (state === "missing") return <p className="notice" role="status">This link is invalid or the alert was already removed.</p>;
  return (
    <>
      <p>Delete this price alert? This removes your email address for this alert.</p>
      {state === "error" && <p className="notice notice--err" role="alert">Something went wrong. Please try again.</p>}
      <button className="btn btn--primary" onClick={go} disabled={state === "busy"}>{state === "busy" ? "Removing…" : "Delete alert"}</button>
    </>
  );
}
