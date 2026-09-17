/**
 * Kept traces.
 *
 * A very small, device-only collection of sensory traces: a colour, one word,
 * and the object or sound that was nearby. No accounts, no server, no scores,
 * no dates shown to the person. Only a handful are ever kept, and everything
 * can be removed in one tap.
 *
 * One canonical object is stored and every screen — the kept card, the shelf,
 * the replay and the companion view — renders from exactly these values.
 */

import type { SceneKey, TraceColourKey } from "@/lib/soma/screens";

export type Trace = {
  id: string;
  /** Which sensory world it came from: Window, Cloth or Thread. */
  scene: SceneKey;
  sceneLabel: string;
  colour: TraceColourKey;
  colourLabel: string;
  word: string;
  /** What was nearby: "Rain, leaves and low light"… */
  nearby: string;
  createdAt: number;
};

export const SCENE_LABELS: Record<SceneKey, string> = {
  window: "Window",
  cloth: "Cloth",
  thread: "Thread",
};

export const COLOUR_LABELS: Record<TraceColourKey, string> = {
  blue: "Deep blue",
  clay: "Warm clay",
  mist: "Pale mist",
};

const KEY = "soma-field-traces";
const LIMIT = 6;

function makeId(): string {
  return `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Build the one canonical object every screen reads from. */
export function createTrace(input: {
  scene: SceneKey;
  colour: TraceColourKey;
  word: string;
  nearby: string;
}): Trace {
  return {
    id: makeId(),
    scene: input.scene,
    sceneLabel: SCENE_LABELS[input.scene],
    colour: input.colour,
    colourLabel: COLOUR_LABELS[input.colour],
    word: input.word,
    nearby: input.nearby,
    createdAt: Date.now(),
  };
}

/** Older saved shapes are completed, never overridden. */
function normalise(value: unknown): Trace | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  const colour = raw["colour"];
  if (colour !== "blue" && colour !== "clay" && colour !== "mist") return null;
  if (typeof raw["word"] !== "string") return null;
  const scene: SceneKey =
    raw["scene"] === "window" || raw["scene"] === "thread" || raw["scene"] === "cloth"
      ? raw["scene"]
      : "cloth";
  return {
    id: typeof raw["id"] === "string" ? raw["id"] : makeId(),
    scene,
    sceneLabel: typeof raw["sceneLabel"] === "string" ? raw["sceneLabel"] : SCENE_LABELS[scene],
    colour,
    colourLabel:
      typeof raw["colourLabel"] === "string" ? raw["colourLabel"] : COLOUR_LABELS[colour],
    word: raw["word"],
    nearby: typeof raw["nearby"] === "string" ? raw["nearby"] : "A quiet moment",
    createdAt: typeof raw["createdAt"] === "number" ? raw["createdAt"] : Date.now(),
  };
}

function write(traces: Trace[]): Trace[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(traces));
    } catch {
      // storage may be unavailable; the trace simply is not kept
    }
  }
  return traces;
}

export function readTraces(): Trace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalise)
      .filter((item): item is Trace => item !== null)
      .slice(0, LIMIT);
  } catch {
    return [];
  }
}

/** Newest first. Older traces fall away quietly once the small shelf is full. */
export function addTrace(trace: Trace): Trace[] {
  return write([trace, ...readTraces()].slice(0, LIMIT));
}

/** Remove a single trace by its own id. Nothing else changes. */
export function removeTraceById(id: string): Trace[] {
  return write(readTraces().filter((item) => item.id !== id));
}

export function clearTraces(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nothing to do
  }
}
