"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { newestCpu } from "../lib/catalog";
import { DEFAULT_ANSWERS, recommend, type Answers } from "../lib/quiz";
import { track } from "./analytics/track";

type Q<K extends keyof Answers> = { key: K; label: string; options: [Answers[K], string][] };
const QUESTIONS: [Q<"use">, Q<"ram">, Q<"drives">, Q<"network">, Q<"media">, Q<"priority">] = [
  { key: "use", label: "What is it mainly for?", options: [["general", "General home server (Docker, Home Assistant, Pi-hole)"], ["proxmox", "Proxmox / several VMs"], ["media", "Plex or Jellyfin"], ["router", "Router / firewall (OPNsense, pfSense)"], ["storage", "Small SSD NAS / backups"]] },
  { key: "ram", label: "How much RAM do you want to be able to install?", options: [[16, "16 GB is plenty"], [32, "32 GB"], [64, "64 GB"]] },
  { key: "drives", label: "How many internal drives?", options: [[1, "One is fine"], [2, "Two (mirror or boot + data)"], [3, "Three"]] },
  { key: "network", label: "Networking?", options: [["1g", "One 1 GbE port is fine"], ["second-port", "A second port without USB"], ["2.5g", "2.5GbE or faster"], ["10g", "10GbE"]] },
  { key: "media", label: "Hardware video transcoding?", options: [["none", "Not needed / not sure"], ["hevc", "4K HEVC (most 4K HDR files)"], ["av1", "AV1 too"]] },
  { key: "priority", label: "Sort results by", options: [["cost", "Lowest cost first (older generations are usually cheaper)"], ["newest", "Newest first"]] },
];

export function Quiz() {
  const [a, setA] = useState<Answers>(DEFAULT_ANSWERS);
  const r = useMemo(() => recommend(a), [a]);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => { setA((p) => ({ ...p, [k]: v })); track("filter_change", { filter: `quiz_${k}` }); };
  return (
    <div className="quiz">
      <p className="quiz__jump small"><a href="#quiz-results">{r.matches.length} matching {r.matches.length === 1 ? "model" : "models"}: see results ↓</a></p>
      <form className="panel quiz__form" onSubmit={(e) => e.preventDefault()}>
        {QUESTIONS.map((q) => (
          <fieldset key={q.key}>
            <legend>{q.label}</legend>
            {q.options.map(([v, label]) => (
              <label key={String(v)} className="check">
                <input type="radio" name={q.key} checked={a[q.key] === v} onChange={() => set(q.key, v as never)} /> {label}
              </label>
            ))}
          </fieldset>
        ))}
      </form>
      <section id="quiz-results" aria-live="polite" aria-label="Results">
        <h2 style={{ marginTop: 0 }}>{r.matches.length ? `${r.matches.length} ${r.matches.length === 1 ? "model fits" : "models fit"}` : "No model meets every requirement"}</h2>
        {r.rules.length > 0 && <p className="small muted">Requirements: {r.rules.join(" · ")}</p>}
        <ul className="cards">
          {r.matches.map(({ model: m, met }) => (
            <li key={m.slug} className="card">
              <Link className="card__title" href={`/models/${m.slug}`}>{m.name}</Link>
              <span className="small muted">{m.released} · {newestCpu(m).generation}</span>
              {met.length > 0 && <ul className="small ticks">{met.map((x) => <li key={x}>✓ {x}</li>)}</ul>}
            </li>
          ))}
        </ul>
        {!r.matches.length && r.nearMisses.length > 0 && (
          <>
            <h3>Closest: each misses one requirement</h3>
            <ul className="cards">
              {r.nearMisses.map(({ model: m, missed }) => (
                <li key={m.slug} className="card">
                  <Link className="card__title" href={`/models/${m.slug}`}>{m.name}</Link>
                  <span className="small">✗ {missed[0]}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {r.matches.length > 1 && (
          <p><Link className="btn btn--primary" href={`/compare?m=${r.matches.slice(0, 3).map((x) => x.model.slug).join(",")}`}>Compare the top {Math.min(3, r.matches.length)} →</Link></p>
        )}
      </section>
    </div>
  );
}
