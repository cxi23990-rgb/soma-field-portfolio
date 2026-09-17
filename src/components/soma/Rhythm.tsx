import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { playLullabyTone } from "@/lib/soma/audio";

/*
 * SCENE 02 — CLOTH & RHYTHM.
 *
 * One piece of faded yellow cotton, drawn in warm line work with a cooler,
 * translucent echo a little behind it — a remembered movement rather than an
 * illustration of a person. Nothing here names the object, asks a question,
 * or scores an answer.
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
        <path d={arc(outer - 12)} fill="none" stroke="var(--clay)" strokeOpacity="0.35" />
      </g>
      <line x1="0" y1={base} x2="260" y2={base} stroke={ink} strokeOpacity="0.28" />
    </svg>
  );
}

type Pulse = { id: number; x: number; y: number };

/**
 * The one continuous cloth, responding to a hand. A slow drag leaves a warm
 * highlight, flattens a fold, and — as the scene settles — reveals a curved,
 * holding-like form breathing quietly. Nothing is counted; nothing is stored.
 */
export function ClothField({
  phase = 0,
  onTouch,
  className,
}: {
  /** 0 arrive · 1 respond · 2 rhythm · 3 rest. */
  phase?: number;
  onTouch?: (touches: number) => void;
  className?: string;
}) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
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
  const step = Math.min(phase, 3);
  /** The fold flattens as the scene moves on, and a curve forms at the end. */
  const flatten = step * 4;
  const curve = step >= 2;

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
      if (now - last.current < 300) return;
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
    [onTouch],
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
        respond(event);
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

      <g className={step >= 2 ? "field-breathe" : undefined}>
        <path
          d="M34 88c46-16 110-16 178 0l-10 78c-54-14-110-14-158 0z"
          fill="var(--linen)"
          fillOpacity="0.92"
          stroke="var(--clay)"
          strokeOpacity="0.55"
          strokeWidth="1.4"
        />
        {[112, 132, 152].map((y, index) => (
          <path
            key={y}
            d={`M42 ${y}c46 ${-Math.max(0, 12 - flatten - index * 2)} 104 ${-Math.max(0, 12 - flatten - index * 2)} 152 0`}
            fill="none"
            stroke="var(--clay)"
            strokeOpacity={0.3 - step * 0.04}
            style={{ transition: "d 900ms ease-out, stroke-opacity 900ms ease-out" }}
          />
        ))}
      </g>

      {/* the holding curve the cloth settles into */}
      {curve ? (
        <g className="field-breathe-slow">
          <path
            d="M56 166A74 74 0 0 1 204 166"
            fill="none"
            stroke="var(--clay)"
            strokeOpacity="0.6"
            strokeWidth="1.8"
            className="trace-draw"
          />
          <path
            d="M78 166A52 52 0 0 1 182 166"
            fill="none"
            stroke="var(--clay)"
            strokeOpacity="0.35"
          />
        </g>
      ) : null}

      {/* The weave warms where the hand has been. */}
      <path
        d="M34 88c46-16 110-16 178 0l-10 78c-54-14-110-14-158 0z"
        fill="var(--clay)"
        style={{ transition: "fill-opacity 700ms ease-out" }}
        fillOpacity={warmth * 0.16 + step * 0.03}
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
