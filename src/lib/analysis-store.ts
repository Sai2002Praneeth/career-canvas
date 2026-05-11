import { useEffect, useState, useSyncExternalStore } from "react";
import type { AnalysisResult } from "./analyze.functions";

export type StoredAnalysis = {
  result: AnalysisResult;
  meta: { role: string; experience: string };
  createdAt: number;
};

const KEY = "interviewflow:analysis";
const listeners = new Set<() => void>();
let cache: StoredAnalysis | null | undefined = undefined;

function read(): StoredAnalysis | null {
  if (typeof window === "undefined") return null;
  if (cache !== undefined) return cache;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as StoredAnalysis) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function setAnalysis(value: StoredAnalysis | null) {
  cache = value;
  if (typeof window !== "undefined") {
    if (value) window.sessionStorage.setItem(KEY, JSON.stringify(value));
    else window.sessionStorage.removeItem(KEY);
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAnalysis(): StoredAnalysis | null {
  // SSR-safe: render null on server, hydrate to real value
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const value = useSyncExternalStore(subscribe, read, () => null);
  return hydrated ? value : null;
}
