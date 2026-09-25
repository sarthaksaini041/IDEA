"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { ModelView } from "../lib/catalog";
import { track } from "./analytics/track";
import { CompareTable } from "./CompareTable";

const MAX = 3;

export function ComparePicker({ items }: { items: ModelView[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const slugs = (params.get("m") || "").split(",").filter((s) => items.some((i) => i.slug === s)).slice(0, MAX);
  const chosen = slugs.map((s) => items.find((i) => i.slug === s)!);

  useEffect(() => {
    if (chosen.length >= 2) track("compare_view", { count: chosen.length });
  }, [chosen.length]);

  const setSlugs = (next: string[]) => {
    router.replace(next.length ? `/compare?m=${next.join(",")}` : "/compare", { scroll: false });
    try {
      localStorage.setItem("tlf-compare", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <div className="two-col" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {Array.from({ length: MAX }).map((_, i) => (
          <div className="field" key={i}>
            <label htmlFor={`cmp-${i}`}>Model {i + 1}</label>
            <select
              id={`cmp-${i}`}
              value={slugs[i] || ""}
              onChange={(e) => {
                const next = [...slugs];
                if (e.target.value) next[i] = e.target.value;
                else next.splice(i, 1);
                setSlugs([...new Set(next.filter(Boolean))]);
              }}
            >
              <option value="">{i < 2 ? "Choose a model…" : "(optional)"}</option>
              {items.map((m) => (
                <option key={m.slug} value={m.slug} disabled={slugs.includes(m.slug) && slugs[i] !== m.slug}>{m.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {chosen.length >= 2 ? (
        <CompareTable models={chosen} />
      ) : (
        <div className="empty">
          <p><strong>Choose at least two models to compare.</strong></p>
          <p className="muted">Or use &quot;Add to compare&quot; on the finder.</p>
        </div>
      )}
    </div>
  );
}
