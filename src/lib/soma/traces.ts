/**
 * Kept traces.
 *
 * A very small, device-only collection of sensory traces: a colour, one word,
 * and the object or sound that was nearby. No accounts, no server, no scores,
 * no dates shown to the person. Only a handful are ever kept, and everything
 * can be removed in one tap.
 */

import type { SceneKey, TraceColourKey } from "@/lib/soma/screens";

export type Trace = {
  colour: TraceColourKey;
  word: string;
  /** What was nearby: "Rain at the window", "A folded cloth"… */
  nearby: string;
  /** Which sensory world it came from: Window, Cloth or Thread. */
  scene?: SceneKey;
};

const KEY = "soma-field-traces";
const LIMIT = 6;

function isTrace(value: unknown): value is Trace {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate["colour"] === "blue" ||
      candidate["colour"] === "clay" ||
      candidate["colour"] === "mist") &&
    typeof candidate["word"] === "string" &&
    typeof candidate["nearby"] === "string"
  );
}


export function readTraces(): Trace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTrace).slice(0, LIMIT);
  } catch {
    return [];
  }
}

/** Newest first. Older traces fall away quietly once the small shelf is full. */
export function addTrace(trace: Trace): Trace[] {
  const next = [trace, ...readTraces()].slice(0, LIMIT);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage may be unavailable; the trace simply is not kept
    }
  }
  return next;
}

/** Remove a single trace. Nothing else changes. */
export function removeTrace(index: number): Trace[] {
  const next = readTraces().filter((_, position) => position !== index);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage may be unavailable
    }
  }
  return next;
}

export function clearTraces(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nothing to do
  }
}
