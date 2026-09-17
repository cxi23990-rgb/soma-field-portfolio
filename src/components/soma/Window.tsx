/*
 * SCENE 01 — WINDOW & SEASON.
 *
 * One room touching a garden: rain on old glass, light coming through it,
 * leaf silhouettes moving outside, and a patch of light on the sill that
 * answers a hand. Line work and flat washes only — no photographs, no
 * weather data, nothing to read or answer.
 */

import { useCallback, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type ArtProps = { className?: string; stage?: number };

const ink = "var(--foreground)";

/** The old frame: two panes, thick painted wood, a sill along the bottom. */
function Frame({ warm = 0 }: { warm?: number }) {
  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id="soma-pane">
          <rect x="26" y="14" width="208" height="140" />
        </clipPath>
      </defs>
      <rect
        x="26"
        y="14"
        width="208"
        height="140"
        fill="var(--sky)"
        fillOpacity={0.14 + warm * 0.06}
        stroke="var(--blue)"
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />
      <rect
        x="26"
        y="14"
        width="208"
        height="140"
        fill="var(--clay)"
        fillOpacity={warm * 0.14}
      />
      <line x1="130" y1="14" x2="130" y2="154" stroke="var(--blue)" strokeOpacity="0.5" strokeWidth="2" />
      <line x1="26" y1="84" x2="234" y2="84" stroke="var(--blue)" strokeOpacity="0.35" />
      {/* sill */}
      <rect x="16" y="154" width="228" height="12" fill="var(--clay)" fillOpacity="0.35" stroke="var(--clay)" strokeOpacity="0.5" />
      <line x1="16" y1="176" x2="244" y2="176" stroke={ink} strokeOpacity="0.22" />
    </g>
  );
}

const STREAKS = [
  { x: 44, delay: 0, len: 26 },
  { x: 62, delay: 1.4, len: 18 },
  { x: 88, delay: 0.7, len: 32 },
  { x: 108, delay: 2.2, len: 22 },
  { x: 150, delay: 0.3, len: 28 },
  { x: 172, delay: 1.8, len: 20 },
  { x: 196, delay: 1.1, len: 34 },
  { x: 216, delay: 2.6, len: 16 },
];

const LEAVES = [
  { cx: 66, cy: 58, r: 20, delay: 0 },
  { cx: 104, cy: 40, r: 14, delay: 1.2 },
  { cx: 168, cy: 62, r: 22, delay: 0.6 },
  { cx: 206, cy: 42, r: 15, delay: 2.1 },
  { cx: 136, cy: 96, r: 17, delay: 1.7 },
];

/** Rain on old glass — used as the still cue on the cue-selection screen. */
export function RainGlass({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  const count = 4 + step * 2;
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame />
      <g clipPath="url(#soma-pane)">
        {STREAKS.slice(0, count).map((streak) => (
          <line
            key={streak.x}
            x1={streak.x}
            y1={0}
            x2={streak.x}
            y2={streak.len}
            stroke="var(--sky)"
            strokeOpacity="0.75"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="rain-fall"
            style={{ animationDelay: `${streak.delay}s`, animationDuration: `${7 + step * 2}s` }}
          />
        ))}
        <path
          d="M26 106c40-18 76 14 116-4s52 8 92-6"
          fill="none"
          stroke="var(--sky)"
          strokeOpacity={0.28 + step * 0.1}
          className="glass-drift"
        />
        <path
          d="M26 128c44-16 72 12 112-6s56 10 96-4"
          fill="none"
          stroke="var(--sky)"
          strokeOpacity="0.2"
          className="glass-drift-slow"
        />
      </g>
    </svg>
  );
}

/** Kept-trace replay for Window: leaf light, moving quietly. */
export function WindowRecall({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame warm={0.18} />
      <g clipPath="url(#soma-pane)">
        <path d="M26 154 100 14h44L48 154z" fill="var(--linen)" fillOpacity="0.28" className="light-breathe" />
        {LEAVES.slice(0, 3).map((leaf) => (
          <g key={leaf.cx} className="leaf-sway" style={{ animationDelay: `${leaf.delay}s` }}>
            <ellipse cx={leaf.cx} cy={leaf.cy} rx={leaf.r * 0.72} ry={leaf.r} fill={ink} fillOpacity="0.14" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * The one continuous window. Rain runs, light arrives, leaf shadows enter and
 * the patch of light on the sill drifts toward wherever a hand passes, warming
 * where it rests. Nothing is counted, and a large fallback button moves the
 * same light without any precise touch.
 */
export function WindowField({
  phase = 0,
  onTouch,
  className,
}: {
  /** 0 arrive · 1 respond · 2 rhythm · 3 rest. */
  phase?: number;
  onTouch?: (touches: number) => void;
  className?: string;
}) {
  const [hand, setHand] = useState<{ x: number; y: number } | null>(null);
  const [x, setX] = useState(78);
  const [warm, setWarm] = useState(0);
  const touches = useRef(0);
  const last = useRef(0);
  const gradientId = useId().replace(/:/g, "");

  const step = Math.min(phase, 3);
  const rain = 4 + step * 2;
  const patchWidth = 72 + step * 10;
  const baseWarm = 0.1 + step * 0.12;

  const answer = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      const px = ((event.clientX - box.left) / box.width) * 260;
      const py = ((event.clientY - box.top) / box.height) * 190;
      setHand({ x: px, y: py });
      setX((current) => current + (Math.max(46, Math.min(200, px)) - current) * 0.4);
      setWarm((value) => Math.min(1, value + 0.08));

      const now = Date.now();
      if (now - last.current < 320) return;
      last.current = now;
      touches.current += 1;
      onTouch?.(touches.current);
    },
    [onTouch],
  );

  return (
    <svg
      viewBox="0 0 260 190"
      className={`${className ?? ""} touch-none cursor-pointer select-none`}
      role="presentation"
      aria-hidden="true"
      onPointerDown={answer}
      onPointerLeave={() => setHand(null)}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" && event.buttons !== 1) {
          const box = event.currentTarget.getBoundingClientRect();
          setHand({
            x: ((event.clientX - box.left) / box.width) * 260,
            y: ((event.clientY - box.top) / box.height) * 190,
          });
          return;
        }
        answer(event);
      }}
    >
      <defs>
        <radialGradient id={`${gradientId}-hand`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--linen)" stopOpacity="0.5" />
          <stop offset="60%" stopColor="var(--linen)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--linen)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Frame warm={baseWarm + warm * 0.3} />
      <g clipPath="url(#soma-pane)">
        {/* rain, always running */}
        {STREAKS.slice(0, rain).map((streak) => (
          <line
            key={streak.x}
            x1={streak.x}
            y1={0}
            x2={streak.x}
            y2={streak.len}
            stroke="var(--sky)"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="rain-fall"
            style={{ animationDelay: `${streak.delay}s`, animationDuration: `${7 + step * 2}s` }}
          />
        ))}

        {/* the light behind the water, widening with the scene */}
        <g className="light-breathe">
          <path
            d="M26 154 96 14h48L48 154z"
            fill="var(--linen)"
            fillOpacity={0.2 + step * 0.08 + warm * 0.1}
            style={{ transition: "fill-opacity 900ms ease-out" }}
          />
        </g>

        {/* leaf shadows enter once the light is there */}
        {step >= 1
          ? LEAVES.slice(0, 2 + step).map((leaf) => (
              <g key={leaf.cx} className="leaf-sway" style={{ animationDelay: `${leaf.delay}s` }}>
                <ellipse
                  cx={leaf.cx}
                  cy={leaf.cy}
                  rx={leaf.r * 0.7}
                  ry={leaf.r}
                  fill={ink}
                  fillOpacity="0.13"
                />
              </g>
            ))
          : null}

        <rect
          x="26"
          y="14"
          width="208"
          height="140"
          fill="var(--clay)"
          fillOpacity={step * 0.05 + warm * 0.12}
          style={{ transition: "fill-opacity 700ms ease-out" }}
        />
      </g>

      {/* the patch on the sill, drifting toward the hand */}
      <g
        transform={`translate(${x - 78} 0)`}
        style={{ transition: "transform 700ms cubic-bezier(0.32,0.72,0.24,1)" }}
      >
        <path
          d={`M42 156h${patchWidth}l10 18H32z`}
          fill="var(--linen)"
          fillOpacity={0.5 + step * 0.06 + warm * 0.2}
          className="light-breathe"
          style={{ transition: "d 700ms ease-out, fill-opacity 700ms ease-out" }}
        />
        <path
          d={`M42 156h${patchWidth}l10 18H32z`}
          fill="var(--clay)"
          fillOpacity={0.06 + step * 0.04 + warm * 0.14}
        />
      </g>
      <line x1="16" y1="176" x2="244" y2="176" stroke={ink} strokeOpacity="0.24" />

      {hand ? (
        <circle
          cx={hand.x}
          cy={hand.y}
          r="40"
          fill={`url(#${gradientId}-hand)`}
          style={{ transition: "cx 300ms ease-out, cy 300ms ease-out" }}
        />
      ) : null}
    </svg>
  );
}
