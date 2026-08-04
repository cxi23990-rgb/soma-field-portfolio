/*
 * SCENE 03 — THREAD & MAKING.
 *
 * One expressive continuous line on a quiet surface. It answers a broad tap
 * or a slow drag by taking another turn: a loop, a second loop, a petal, a
 * simple woven rhythm. Nothing is correct, nothing is finished, nothing is
 * counted. The form may be left half-made.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { playLullabyTone } from "@/lib/soma/audio";

type ArtProps = { className?: string; stage?: number };

const ink = "var(--foreground)";

/** The quiet surface the thread rests on. */
function Surface() {
  return (
    <g aria-hidden="true">
      <line x1="0" y1="164" x2="260" y2="164" stroke={ink} strokeOpacity="0.28" />
      <line x1="0" y1="170" x2="260" y2="170" stroke={ink} strokeOpacity="0.12" />
    </g>
  );
}

/** A loose thread waiting, with one slow breath of tension. */
export function ThreadCue({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Surface />
      <path
        d="M18 150c34 6 42-40 78-40 30 0 34 34 62 34 24 0 30-26 66-30"
        fill="none"
        stroke="var(--clay)"
        strokeWidth="2"
        strokeLinecap="round"
        className="trace-draw thread-tension"
      />
      {/* fibre: a second, thinner line just beside the first */}
      <path
        d="M18 154c34 6 42-40 78-40 30 0 34 34 62 34 24 0 30-26 66-30"
        fill="none"
        stroke="var(--clay)"
        strokeOpacity="0.32"
        strokeWidth="0.8"
        className="thread-tension"
      />
      {step > 0 ? (
        <circle cx="96" cy="112" r="13" fill="none" stroke="var(--clay)" strokeOpacity="0.5" className="stitch-appear" />
      ) : null}
      {step > 1 ? (
        <circle cx="224" cy="114" r="7" fill="var(--clay)" fillOpacity="0.4" className="stitch-appear" />
      ) : null}
    </svg>
  );
}

/** The form at rest: whatever was made, breathing slowly. */
export function ThreadRest({ className, stage = 0 }: ArtProps) {
  const step = Math.min(stage, 2);
  const r = 34 + step * 5;
  return (
    <svg viewBox="0 0 260 190" className={className} role="presentation" aria-hidden="true">
      <Surface />
      <g className="field-breathe-slow">
        {[0, 1, 2, 3].slice(0, 2 + step).map((i) => {
          const angle = (i * Math.PI) / 2.6;
          const cx = 130 + Math.cos(angle) * 18;
          const cy = 104 + Math.sin(angle) * 12;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={r}
              ry={r * 0.6}
              fill="none"
              stroke="var(--clay)"
              strokeOpacity={0.55 - i * 0.08}
              strokeWidth="1.6"
              transform={`rotate(${i * 34} ${cx} ${cy})`}
            />
          );
        })}
      </g>
      <path
        d="M18 152c30 4 48-8 74-16"
        fill="none"
        stroke="var(--clay)"
        strokeOpacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Turn = { id: number; x: number; y: number; r: number; tilt: number };

/**
 * The thread taking turns. A broad tap or a slow drag anywhere adds one turn
 * to the same continuous line: a loop, then another, then a petal. There is
 * no target, no score, and stopping half-made is a complete ending.
 */
export function ThreadField({
  mode,
  onTouch,
  className,
}: {
  mode: "loop" | "weave";
  onTouch?: (turns: number) => void;
  className?: string;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [hand, setHand] = useState<{ x: number; y: number } | null>(null);
  const [tension, setTension] = useState(0);
  const count = useRef(0);
  const last = useRef(0);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    count.current = 0;
  }, [mode]);

  const follow = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setHand({
      x: ((event.clientX - box.left) / box.width) * 260,
      y: ((event.clientY - box.top) / box.height) * 190,
    });
  }, []);

  const respond = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const now = Date.now();
      if (now - last.current < 380) return;
      last.current = now;

      const box = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 260;
      const y = ((event.clientY - box.top) / box.height) * 190;

      setHand({ x, y });
      setTension((value) => Math.min(1, value + 0.14));
      setTurns((current) => [
        ...current.slice(-7),
        {
          id: now,
          x,
          y,
          r: mode === "weave" ? 16 + (count.current % 3) * 6 : 22 + (count.current % 4) * 5,
          tilt: (count.current % 5) * 26,
        },
      ]);

      playLullabyTone(count.current);
      count.current += 1;
      onTouch?.(count.current);
    },
    [mode, onTouch],
  );

  /** One continuous line through every turn the hand has made. */
  const line = turns.length
    ? turns.reduce(
        (path, turn, index) =>
          index === 0
            ? `M18 152C60 150 ${turn.x - 40} ${turn.y + 30} ${turn.x} ${turn.y}`
            : `${path}C${turns[index - 1]!.x + 30} ${turns[index - 1]!.y - 20} ${turn.x - 30} ${turn.y + 24} ${turn.x} ${turn.y}`,
        "",
      )
    : "M18 152c34 6 42-40 78-40 30 0 34 34 62 34 24 0 30-26 66-30";

  return (
    <svg
      viewBox="0 0 260 190"
      className={`${className ?? ""} touch-none cursor-pointer select-none`}
      role="presentation"
      aria-hidden="true"
      onPointerDown={respond}
      onPointerLeave={() => setHand(null)}
      onPointerMove={(event) => {
        follow(event);
        if (event.pointerType === "mouse" && event.buttons !== 1) return;
        if (mode === "weave") respond(event);
      }}
    >
      <defs>
        <radialGradient id={`${gradientId}-touch`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--linen)" stopOpacity="0.45" />
          <stop offset="60%" stopColor="var(--linen)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--linen)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Surface />

      {/* the surface warms a little where the thread has been worked */}
      <rect
        x="0"
        y="40"
        width="260"
        height="130"
        fill="var(--clay)"
        style={{ transition: "fill-opacity 800ms ease-out" }}
        fillOpacity={tension * 0.1}
      />

      {/* the turns: loops, then petals, all on one line */}
      <g>
        {turns.map((turn, index) => (
          <g
            key={turn.id}
            className="stitch-appear"
            transform={`rotate(${turn.tilt} ${turn.x} ${turn.y})`}
          >
            <ellipse
              cx={turn.x}
              cy={turn.y}
              rx={turn.r}
              ry={turn.r * (mode === "weave" ? 0.44 : 0.66)}
              fill="var(--clay)"
              fillOpacity={0.06 + index * 0.015}
              stroke="var(--clay)"
              strokeOpacity={0.65 - index * 0.05}
              strokeWidth="1.8"
            />
            <ellipse
              cx={turn.x}
              cy={turn.y}
              rx={turn.r - 3}
              ry={turn.r * (mode === "weave" ? 0.44 : 0.66) - 2}
              fill="none"
              stroke="var(--clay)"
              strokeOpacity="0.22"
              strokeWidth="0.7"
            />
          </g>
        ))}
      </g>

      <path
        d={line}
        fill="none"
        stroke="var(--clay)"
        strokeWidth="2"
        strokeLinecap="round"
        className="thread-tension"
        style={{ transition: "d 700ms cubic-bezier(0.32,0.72,0.24,1)" }}
      />
      <path
        d={line}
        fill="none"
        stroke="var(--clay)"
        strokeOpacity="0.3"
        strokeWidth="0.8"
        transform="translate(0 3.5)"
      />

      {hand ? (
        <circle
          cx={hand.x}
          cy={hand.y}
          r="42"
          fill={`url(#${gradientId}-touch)`}
          style={{ transition: "cx 320ms ease-out, cy 320ms ease-out" }}
        />
      ) : null}
    </svg>
  );
}
