/*
 * SCENE 01 — WINDOW & SEASON.
 *
 * A room touching a garden: rain on old glass, light coming through it,
 * leaf silhouettes moving outside, a patch of light on the sill, and the
 * warmth of an afternoon changing. Line work and flat washes only — no
 * photographs, no weather data, nothing to read or answer.
 */

import { useCallback, useId, useState } from "react";
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

/** Rain on old glass. Later stages: slower, heavier water and soft distortion. */
export function RainGlass({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  const count = 4 + step * 2;
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame />
      <g clipPath="url(#soma-pane)">
        {/* water gathering: slow, uneven, never a pattern */}
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
        {/* glass distortion: the garden behind the water bends a little */}
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
        {step > 0 ? (
          <circle cx="196" cy="62" r="4" fill="var(--sky)" fillOpacity="0.6" className="field-breathe" />
        ) : null}
        {step > 1 ? (
          <circle cx="72" cy="46" r="3" fill="var(--sky)" fillOpacity="0.5" className="field-breathe-slow" />
        ) : null}
      </g>
    </svg>
  );
}

/** Light coming through the rain, laid across the panes. */
export function GlassLight({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame warm={step * 0.2} />
      <g clipPath="url(#soma-pane)">
        <g className="light-breathe">
          <path
            d="M26 154 96 14h48L48 154z"
            fill="var(--linen)"
            fillOpacity={0.3 + step * 0.08}
          />
          <path
            d="M118 154 188 14h34l-70 140z"
            fill="var(--linen)"
            fillOpacity={0.18 + step * 0.06}
          />
        </g>
        <line x1="26" y1="118" x2="234" y2="118" stroke="var(--linen)" strokeOpacity="0.35" />
      </g>
      <path
        d="M40 176c46-10 92-10 140 0"
        fill="none"
        stroke="var(--linen)"
        strokeOpacity={0.4 + step * 0.12}
        className="light-breathe"
      />
    </svg>
  );
}

const LEAVES = [
  { cx: 66, cy: 58, r: 20, delay: 0 },
  { cx: 104, cy: 40, r: 14, delay: 1.2 },
  { cx: 168, cy: 62, r: 22, delay: 0.6 },
  { cx: 206, cy: 42, r: 15, delay: 2.1 },
  { cx: 136, cy: 96, r: 17, delay: 1.7 },
];

/** Leaf silhouettes moving across the glass. */
export function LeafShadow({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame warm={0.1} />
      <g clipPath="url(#soma-pane)">
        <g className="light-breathe">
          <path d="M26 154 96 14h48L48 154z" fill="var(--linen)" fillOpacity="0.26" />
        </g>
        {LEAVES.slice(0, 3 + step).map((leaf) => (
          <g key={`${leaf.cx}-${leaf.cy}`} className="leaf-sway" style={{ animationDelay: `${leaf.delay}s` }}>
            <path
              d={`M${leaf.cx} ${leaf.cy - leaf.r}c${leaf.r} ${leaf.r * 0.5} ${leaf.r} ${leaf.r * 1.4} 0 ${leaf.r * 2}c-${leaf.r} -${leaf.r * 0.6} -${leaf.r} -${leaf.r * 1.5} 0 -${leaf.r * 2}z`}
              fill={ink}
              fillOpacity="0.16"
              stroke={ink}
              strokeOpacity="0.28"
            />
            <line
              x1={leaf.cx}
              y1={leaf.cy - leaf.r}
              x2={leaf.cx}
              y2={leaf.cy + leaf.r}
              stroke={ink}
              strokeOpacity="0.24"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A patch of light on the sill, migrating a little further each time. */
export function SillPatch({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 3);
  const x = 42 + step * 26;
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame warm={0.12 + step * 0.06} />
      <g clipPath="url(#soma-pane)">
        <path d="M26 154 96 14h44L46 154z" fill="var(--linen)" fillOpacity="0.22" className="light-breathe" />
      </g>
      {/* the patch itself, resting on the wood */}
      <g style={{ transition: "transform 900ms cubic-bezier(0.32,0.72,0.24,1)" }} transform={`translate(${x - 42} 0)`}>
        <path
          d="M42 156h72l10 18H32z"
          fill="var(--linen)"
          fillOpacity="0.6"
          className="light-breathe"
        />
        <path
          d="M42 156h72l10 18H32z"
          fill="var(--clay)"
          fillOpacity={0.06 + step * 0.05}
        />
      </g>
      <line x1="16" y1="176" x2="244" y2="176" stroke={ink} strokeOpacity="0.24" />
    </svg>
  );
}

/** The warmth of the afternoon changing — colour, not motion. */
export function AfternoonWarmth({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 3);
  const warm = 0.2 + step * 0.16;
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Frame warm={warm} />
      <g clipPath="url(#soma-pane)">
        <rect
          x="26"
          y="14"
          width="208"
          height="140"
          fill="var(--clay)"
          fillOpacity={warm * 0.3}
          style={{ transition: "fill-opacity 900ms ease-out" }}
        />
        <path d="M26 154 108 14h40L52 154z" fill="var(--linen)" fillOpacity={0.3 + step * 0.04} className="light-breathe" />
        {LEAVES.slice(0, 2).map((leaf) => (
          <g key={leaf.cx} className="leaf-sway" style={{ animationDelay: `${leaf.delay}s` }}>
            <ellipse cx={leaf.cx} cy={leaf.cy} rx={leaf.r * 0.7} ry={leaf.r} fill={ink} fillOpacity="0.12" />
          </g>
        ))}
      </g>
      <path
        d="M42 166h80l10 10H32z"
        fill="var(--linen)"
        fillOpacity={0.4 + step * 0.08}
        className="field-breathe-slow"
      />
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
 * The sill answering a hand. The patch of light drifts toward wherever the
 * hand passes and warms where it rests. Nothing is counted, and the buttons
 * remain a lower-effort way through the same scene.
 */
export function WindowField({ className }: { className?: string }) {
  const [hand, setHand] = useState<{ x: number; y: number } | null>(null);
  const [x, setX] = useState(78);
  const [warm, setWarm] = useState(0);
  const gradientId = useId().replace(/:/g, "");

  const answer = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * 260;
    const py = ((event.clientY - box.top) / box.height) * 190;
    setHand({ x: px, y: py });
    setX((current) => current + (Math.max(46, Math.min(200, px)) - current) * 0.35);
    setWarm((value) => Math.min(1, value + 0.06));
  }, []);

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

      <Frame warm={0.12 + warm * 0.3} />
      <g clipPath="url(#soma-pane)">
        <path d="M26 154 96 14h44L46 154z" fill="var(--linen)" fillOpacity="0.22" className="light-breathe" />
        <rect
          x="26"
          y="14"
          width="208"
          height="140"
          fill="var(--clay)"
          fillOpacity={warm * 0.12}
          style={{ transition: "fill-opacity 700ms ease-out" }}
        />
      </g>

      {/* the patch, drifting toward the hand */}
      <g
        transform={`translate(${x - 78} 0)`}
        style={{ transition: "transform 700ms cubic-bezier(0.32,0.72,0.24,1)" }}
      >
        <path d="M42 156h72l10 18H32z" fill="var(--linen)" fillOpacity={0.55 + warm * 0.25} className="light-breathe" />
        <path d="M42 156h72l10 18H32z" fill="var(--clay)" fillOpacity={0.06 + warm * 0.16} />
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
