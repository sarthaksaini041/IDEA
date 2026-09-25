"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "tlf-compare";
const MAX = 3;

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

/** Compare selection, remembered per browser (a convenience only; the URL is the source of truth). */
export function useCompare() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => setList(read()), []);
  const save = useCallback((next: string[]) => {
    setList(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode); selection still works for this page view
    }
  }, []);
  return {
    list,
    max: MAX,
    full: list.length >= MAX,
    toggle: (slug: string) => save(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug].slice(0, MAX)),
    clear: () => save([]),
  };
}
