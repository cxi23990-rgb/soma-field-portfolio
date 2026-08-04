import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { playLullabyTone } from "@/lib/soma/audio";

/*
 * A FAMILIAR RHYTHM.
 *
 * Two layers everywhere: the present object drawn in warm, earthy line work,
 * and a cooler, translucent echo of the same shape a little behind it — a
 * remembered movement rather than an illustration of a person. Nothing here
 * names the object, asks a question, or scores an answer.
 */

type ArtProps = { className?: string; stage?: number };

const ink = "var(--foreground)";

/** Soft window light behind the object. */
function WindowLight() {
  return (
    <g aria-hidden="true">
      <rect x="176" y="0" width="84" height="200" fill="var(--sky)" fillOpacity="0.16" />
      <rect x="176" y="0" width="84" height="200" fill="none" stroke="var(--sky)" strokeOpacity="0.3" />
      <line x1="204" y1="0" x2="204" y2="200" stroke="var(--sky)" strokeOpacity="0.28" />
      <line x1="232" y1="0" x2="232" y2="200" stroke="var(--sky)" strokeOpacity="0.2" />
    </g>
  );
}

/** Stage 0–2: a pale yellow curve arriving, without being named. */
export function RhythmCue({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  return (
    <svg viewBox="0 0 260 200" className={className} role="presentation" aria-hidden="true">
      <WindowLight />
      <path
        d="M22 158c14-58 62-96 118-96 34 0 60 14 78 34"
        fill="none"
        stroke="var(--linen)"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="trace-draw"
        opacity={0.95}
      />
      <path
        d="M22 170c14-58 62-96 118-96 34 0 60 14 78 34"
        fill="none"
        stroke="var(--linen)"
        strokeOpacity="0.4"
        strokeWidth="1.2"
        className="echo-drift"
      />

      {step > 0 ? (
        <circle cx="60" cy="170" r="18" fill="none" stroke={ink} strokeOpacity="0.4" className="stitch-appear" />
      ) : null}
      {step > 1 ? (
        <circle cx="176" cy="170" r="18" fill="none" stroke={ink} strokeOpacity="0.4" className="stitch-appear" />
      ) : null}
      <line x1="0" y1="188" x2="260" y2="188" stroke={ink} strokeOpacity="0.3" />
    </svg>
  );
}

/** A folded pale-yellow textile, coming a little closer with each stage. */
export function FoldedTextile({ className, stage = 0 }: ArtProps) {
  const near = Math.min(stage, 2) * 8;
  return (
    <svg viewBox="0 0 260 200" className={className} role="presentation" aria-hidden="true">
      <WindowLight />
      <g className="echo-drift" opacity="0.5">
        <path
          d={`M52 ${104 - near}h150l-14 62H62z`}
          fill="var(--sky)"
          fillOpacity="0.22"
          stroke="var(--sky)"
          strokeOpacity="0.4"
        />
      </g>
      <g className="field-breathe-slow">
        <path
          d={`M44 ${100 - near}c40-14 100-14 156 0l-12 66c-44-12-92-12-132 0z`}
          fill="var(--linen)"
          fillOpacity="0.9"
          stroke="var(--clay)"
          strokeOpacity="0.55"
        />
        <path
          d={`M50 ${124 - near}c42-12 96-12 144 0`}
          fill="none"
          stroke="var(--clay)"
          strokeOpacity="0.4"
        />
        <path
          d={`M52 ${144 - near}c42-12 92-12 138 0`}
          fill="none"
          stroke="var(--clay)"
          strokeOpacity="0.28"
        />
      </g>
      <line x1="0" y1="184" x2="260" y2="184" stroke={ink} strokeOpacity="0.28" />
    </svg>
  );
}

/** The cloth taking the curved shape of an embrace — an open arc, never a figure. */
export function EmbraceForm({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 3);
  const outer = 62 + step * 8;
  const inner = outer - 26 - step * 2;
  const base = 168;
  const arc = (r: number, sweep = 1) =>
    `M${130 - r} ${base}A${r} ${r} 0 0 ${sweep} ${130 + r} ${base}`;
  return (
    <svg viewBox="0 0 260 200" className={className} role="presentation" aria-hidden="true">
      <WindowLight />
      <path
        d={arc(outer + 9)}
        fill="none"
        stroke="var(--sky)"
        strokeOpacity="0.45"
        strokeWidth="1.4"
        className="echo-drift"
      />
      <g className="field-breathe-slow">
        <path
          d={`${arc(outer)}L${130 + inner} ${base}A${inner} ${inner} 0 0 1 ${130 - inner} ${base}Z`}
          fill="var(--linen)"
          fillOpacity="0.75"
          stroke="var(--clay)"
          strokeOpacity="0.6"
          strokeWidth="1.6"
        />
        <path
          d={arc(outer - 12)}
          fill="none"
          stroke="var(--clay)"
          strokeOpacity="0.35"
        />
      </g>
      <line x1="0" y1={base} x2="260" y2={base} stroke={ink} strokeOpacity="0.28" />
    </svg>

  );
}

type Pulse = { id: number; x: number; y: number };

/**
 * The cloth, responding to a hand. Smoothing or a slow patting rhythm — each
 * touch leaves a widening pulse, a delayed outline behind it, and one soft
 * lullaby tone. Nothing is counted for the person; nothing is stored.
 */
export function ClothField({
  mode,
  onTouch,
  className,
}: {
  mode: "smooth" | "pat";
  onTouch?: (touches: number) => void;
  className?: string;
}) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  /** Where the hand is now, and how warm the cloth has become. */
  const [hand, setHand] = useState<{ x: number; y: number } | null>(null);
  const [warmth, setWarmth] = useState(0);
  const touches = useRef(0);
  const last = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const id of timers.current) window.clearTimeout(id);
    },
    [],
  );

  const gradientId = useId().replace(/:/g, "");

  /** The surface answers where the hand passes, with or without a tap. */
  const follow = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setHand({
      x: ((event.clientX - box.left) / box.width) * 260,
      y: ((event.clientY - box.top) / box.height) * 200,
    });
  }, []);

  const respond = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const now = Date.now();
      if (now - last.current < (mode === "pat" ? 420 : 260)) return;
      last.current = now;

      const box = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 260;
      const y = ((event.clientY - box.top) / box.height) * 200;
      const id = now;

      setHand({ x, y });
      setWarmth((value) => Math.min(1, value + 0.12));
      setPulses((current) => [...current.slice(-4), { id, x, y }]);
      const timer = window.setTimeout(() => {
        setPulses((current) => current.filter((pulse) => pulse.id !== id));
      }, 1800);
      timers.current = [...timers.current.slice(-8), timer];

      playLullabyTone(touches.current);
      touches.current += 1;
      onTouch?.(touches.current);
    },
    [mode, onTouch],
  );

  return (
    <svg
      viewBox="0 0 260 200"
      className={`${className ?? ""} touch-none cursor-pointer select-none`}
      role="presentation"
      aria-hidden="true"
      onPointerDown={respond}
      onPointerLeave={() => setHand(null)}
      onPointerMove={(event) => {
        follow(event);
        if (event.pointerType === "mouse" && event.buttons !== 1) return;
        if (mode === "smooth") respond(event);
      }}
    >
      <defs>
        <radialGradient id={`${gradientId}-warm`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--clay)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="var(--clay)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--clay)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <WindowLight />

      <g className="echo-drift" opacity="0.55">
        <path
          d="M40 92c44-16 108-16 176 0l-10 74c-52-14-108-14-156 0z"
          fill="var(--sky)"
          fillOpacity="0.2"
          stroke="var(--sky)"
          strokeOpacity="0.35"
        />
      </g>

      <g className={mode === "pat" ? "field-breathe" : undefined}>
        <path
          d="M34 88c46-16 110-16 178 0l-10 78c-54-14-110-14-158 0z"
          fill="var(--linen)"
          fillOpacity="0.92"
          stroke="var(--clay)"
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        {[112, 132, 152].map((y) => (
          <path
            key={y}
            d={`M42 ${y}c46-12 104-12 152 0`}
            fill="none"
            stroke="var(--clay)"
            strokeOpacity="0.3"
          />
        ))}
      </g>

      {/* The weave warms where the hand has been. */}
      <path
        d="M34 88c46-16 110-16 178 0l-10 78c-54-14-110-14-158 0z"
        fill="var(--clay)"
        style={{ transition: "fill-opacity 700ms ease-out" }}
        fillOpacity={warmth * 0.16}
      />

      {/* A soft light that follows the hand across the cloth. */}
      {hand ? (
        <circle
          cx={hand.x}
          cy={hand.y}
          r="46"
          fill={`url(#${gradientId}-warm)`}
          style={{
            transition: "cx 320ms ease-out, cy 320ms ease-out, opacity 500ms ease-out",
          }}
        />
      ) : null}

      {pulses.map((pulse) => (
        <g key={pulse.id}>
          <circle
            cx={pulse.x}
            cy={pulse.y}
            r="14"
            fill="none"
            stroke="var(--sky)"
            strokeWidth="1.6"
            className="touch-pulse"
          />
          <circle
            cx={pulse.x}
            cy={pulse.y}
            r="14"
            fill="none"
            stroke="var(--clay)"
            strokeOpacity="0.5"
            className="touch-pulse-echo"
          />
        </g>
      ))}
    </svg>
  );
}
