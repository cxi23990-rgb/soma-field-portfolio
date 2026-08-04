type ArtProps = { className?: string; stage?: number };

const stroke = "var(--foreground)";


/** Spiral trace inside a breathing field — the first quiet encounter. */
export function SpiralField({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="presentation" aria-hidden="true">
      <circle cx="120" cy="120" r="112" fill="var(--field)" className="field-breathe-slow" />
      <circle cx="120" cy="120" r="92" fill="none" stroke={stroke} strokeOpacity="0.28" />
      <path
        d="M52 172c-8-52 26-96 74-96 34 0 56 24 56 50 0 24-20 40-40 40-18 0-30-13-30-27 0-13 10-22 21-22 10 0 17 7 17 15 0 7-5 12-11 12"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        className="trace-draw"
      />
      <circle cx="52" cy="172" r="9" fill="none" stroke={stroke} strokeOpacity="0.7" />
    </svg>
  );
}

/** Concentric rings — sound, listening, rhythm. */
export function RingField({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="presentation" aria-hidden="true">
      <circle cx="120" cy="120" r="104" fill="none" stroke="var(--clay)" strokeOpacity="0.5" />
      <circle
        cx="120"
        cy="120"
        r="74"
        fill="none"
        stroke="var(--clay)"
        strokeOpacity="0.8"
        className="field-breathe"
      />
      <circle cx="120" cy="120" r="44" fill="none" stroke="var(--clay)" strokeOpacity="0.6" />
    </svg>
  );
}

/** Folded pale yellow cotton over a wooden frame — the fabric landscape. */
export function ClothForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 260 200" className={className} role="presentation" aria-hidden="true">
      <g className="field-breathe-slow">
        <path d="M70 96 130 62l90 22-58 40z" fill="var(--linen)" fillOpacity="0.9" stroke="var(--clay)" />
        <path d="M70 96v42l92 42V138z" fill="var(--linen)" fillOpacity="0.7" stroke="var(--clay)" />
        <path d="M162 138 220 98v40l-58 42z" fill="var(--linen)" fillOpacity="0.55" stroke="var(--clay)" />
        <path d="M130 62 70 96" stroke="var(--clay)" strokeOpacity="0.5" fill="none" />
      </g>
      <path d="M130 74v96" stroke="var(--clay)" strokeWidth="1.5" strokeOpacity="0.7" />

      {[
        [60, 190, 92, 108],
        [104, 192, 118, 118],
        [196, 190, 176, 118],
        [232, 186, 208, 112],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={stroke}
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** Wooden frame with yarn resting beside it — the MAKE landmark. */
export function FrameForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <rect
        x="52"
        y="34"
        width="136"
        height="118"
        fill="none"
        stroke="var(--blue)"
        strokeWidth="1.6"
      />
      <line x1="52" y1="152" x2="188" y2="152" stroke="var(--clay)" strokeWidth="3" />
      <circle
        cx="196"
        cy="170"
        r="16"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.6"
        className="field-breathe"
      />
      <path
        d="M196 170c-22 4-40-2-54-12"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A single held disc — the light trace that may be kept. */
export function TraceForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 160" className={className} role="presentation" aria-hidden="true">
      <circle cx="80" cy="80" r="62" fill="var(--blue)" className="field-breathe" />
      <circle cx="80" cy="80" r="22" fill="var(--mist)" />
    </svg>
  );
}

/** Abstract companion — clearly an object, never a person. */
export function CompanionForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 220 220" className={className} role="presentation" aria-hidden="true">
      <circle
        cx="110"
        cy="110"
        r="98"
        fill="var(--field)"
        stroke={stroke}
        strokeOpacity="0.3"
        className="field-breathe-slow"
      />
      <circle cx="110" cy="90" r="38" fill="var(--ivory)" />
      <rect x="66" y="122" width="88" height="34" rx="14" fill="var(--ivory)" />
    </svg>
  );
}

/** Speaking object — visibly a machine. */
export function RobotForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 220 200" className={className} role="presentation" aria-hidden="true">
      <line x1="110" y1="6" x2="110" y2="30" stroke="var(--blue)" />
      <circle cx="110" cy="34" r="7" fill="var(--clay)" className="field-breathe" />
      <rect
        x="46"
        y="52"
        width="128"
        height="118"
        rx="26"
        fill="var(--ivory)"
        stroke="var(--blue)"
        strokeWidth="1.6"
      />
      <circle cx="86" cy="102" r="10" fill="var(--slate)" />
      <circle cx="134" cy="102" r="10" fill="var(--slate)" />
      <line x1="86" y1="136" x2="134" y2="136" stroke="var(--blue)" strokeWidth="1.6" />
    </svg>
  );
}

/** Light across a quiet room — SETTLE. */
export function RoomForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <rect
        x="72"
        y="26"
        width="96"
        height="120"
        rx="4"
        fill="var(--mist)"
        fillOpacity="0.65"
        stroke="var(--blue)"
      />
      <line x1="120" y1="26" x2="120" y2="146" stroke="var(--blue)" strokeOpacity="0.5" />
      <line x1="72" y1="86" x2="168" y2="86" stroke="var(--blue)" strokeOpacity="0.5" />
      <ellipse
        cx="120"
        cy="176"
        rx="86"
        ry="14"
        fill={stroke}
        fillOpacity="0.12"
        className="field-breathe"
      />
    </svg>
  );
}

/** Loose pieces to move or simply look at — THINK. */
export function PiecesForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <rect x="40" y="60" width="62" height="62" fill="none" stroke="var(--blue)" />
      <rect
        x="118"
        y="60"
        width="62"
        height="62"
        fill="var(--mist)"
        fillOpacity="0.5"
        stroke="var(--blue)"
        className="field-breathe"
      />
      <circle cx="196" cy="140" r="22" fill="none" stroke="var(--clay)" />
      <line x1="40" y1="152" x2="180" y2="152" stroke={stroke} strokeOpacity="0.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Route-specific compositions. Each accepts `stage`, so repeated taps
 * change the object a little instead of doing nothing.
 * ------------------------------------------------------------------ */

/** MAKE — yarn, wooden frame, one fold of cloth. Gains a stitch per fold. */
export function YarnForm({ className, stage = 0 }: ArtProps) {
  const stitches = Math.min(stage, 7);
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <line x1="34" y1="44" x2="34" y2="172" stroke="var(--clay)" strokeWidth="3" />
      <line x1="206" y1="44" x2="206" y2="172" stroke="var(--clay)" strokeWidth="3" />
      <line x1="26" y1="50" x2="214" y2="50" stroke="var(--clay)" strokeWidth="3" />
      <path
        d="M34 96c34 22 62-12 96 6s52-4 76 10"
        fill="none"
        stroke="var(--blue)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
      <path
        d="M34 118c30 26 66-8 96 10s54-2 76 12v34H34z"
        fill="var(--mist)"
        fillOpacity="0.45"
        stroke="var(--blue)"
        strokeOpacity="0.5"
      />
      {Array.from({ length: stitches }).map((_, i) => {
        const x = 50 + i * 22;
        const y = 104 + (i % 2) * 9;
        return (
          <g key={i} className="stitch-appear" style={{ animationDelay: `${i * 40}ms` }}>
            <line x1={x - 6} y1={y - 5} x2={x + 6} y2={y + 5} stroke={stroke} strokeLinecap="round" />
            <line x1={x + 6} y1={y - 5} x2={x - 6} y2={y + 5} stroke={stroke} strokeOpacity="0.5" strokeLinecap="round" />
          </g>
        );
      })}
      <circle
        cx="196"
        cy="176"
        r="15"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.6"
        className="field-breathe"
      />
      <path
        d="M182 176c-26 4-44-4-58-14"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** THINK — familiar pieces on a table; one piece shifts each time you stay. */
export function TableForm({ className, stage = 0 }: ArtProps) {
  const step = stage % 4;
  const shift = [0, 26, 26, 52][step]!;
  const lift = [0, 0, -18, -18][step]!;
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <line x1="24" y1="158" x2="216" y2="158" stroke={stroke} strokeOpacity="0.35" />
      <line x1="44" y1="158" x2="34" y2="188" stroke={stroke} strokeOpacity="0.2" />
      <line x1="196" y1="158" x2="206" y2="188" stroke={stroke} strokeOpacity="0.2" />
      <rect x="40" y="86" width="52" height="52" fill="none" stroke="var(--blue)" />
      <circle cx="120" cy="60" r="17" fill="none" stroke="var(--clay)" strokeOpacity="0.8" />
      <rect
        x={112 + shift}
        y={86 + lift}
        width="52"
        height="52"
        fill="var(--mist)"
        fillOpacity="0.5"
        stroke="var(--blue)"
        className="piece-shift"
      />
      <line
        x1="66"
        y1="112"
        x2={138 + shift}
        y2={112 + lift}
        stroke={stroke}
        strokeOpacity="0.22"
        strokeDasharray="3 6"
      />
    </svg>
  );
}

/** SETTLE — a threshold, floor light, curtain shadow. */
export function ThresholdForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <rect x="58" y="18" width="124" height="126" fill="none" stroke="var(--blue)" strokeWidth="1.6" />
      <rect
        x="70"
        y="30"
        width="46"
        height="102"
        fill="var(--mist)"
        fillOpacity="0.6"
        stroke="none"
        className="field-breathe-slow"
      />
      <path
        d="M124 30c10 26 6 58 0 102"
        fill="none"
        stroke="var(--blue)"
        strokeOpacity="0.55"
      />
      <path
        d="M136 30c12 30 8 66 2 102"
        fill="none"
        stroke="var(--blue)"
        strokeOpacity="0.3"
      />
      <path
        d="M70 144 34 190h126l-44-46z"
        fill={stroke}
        fillOpacity="0.1"
      />
      <line x1="24" y1="190" x2="216" y2="190" stroke={stroke} strokeOpacity="0.25" />
    </svg>
  );
}

/** SETTLE companion — a circular field that settles a little further each stay. */
export function BreathField({ className, stage = 0 }: ArtProps) {
  const step = stage % 3;
  const radius = [70, 60, 50][step]!;
  const warmth = [0.18, 0.3, 0.44][step]!;
  return (
    <svg viewBox="0 0 200 200" className={className} role="presentation" aria-hidden="true">
      <circle cx="100" cy="100" r="88" fill="none" stroke={stroke} strokeOpacity="0.16" />
      <circle
        cx="100"
        cy="100"
        r={radius + 14}
        fill="var(--clay)"
        fillOpacity={warmth * 0.25}
        className="field-breathe-slow"
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="var(--blue)"
        fillOpacity="0.55"
        stroke="var(--clay)"
        strokeOpacity={warmth + 0.3}
        className="field-breathe contour-settle"
      />
      <circle cx="100" cy="100" r={radius / 3} fill="var(--mist)" fillOpacity="0.85" />
    </svg>
  );
}

/** TALK — a tabletop machine with a restrained waveform and a listening light. */
export function MachineForm({ className, stage = 0 }: ArtProps) {
  const bars = [10, 22, 14, 30, 18, 26, 12];
  return (
    <svg viewBox="0 0 240 200" className={className} role="presentation" aria-hidden="true">
      <rect
        x="54"
        y="46"
        width="132"
        height="96"
        rx="10"
        fill="var(--ivory)"
        stroke="var(--blue)"
        strokeWidth="1.6"
      />
      <line x1="40" y1="158" x2="200" y2="158" stroke={stroke} strokeOpacity="0.3" />
      <line x1="90" y1="142" x2="90" y2="158" stroke="var(--blue)" strokeOpacity="0.6" />
      <line x1="150" y1="142" x2="150" y2="158" stroke="var(--blue)" strokeOpacity="0.6" />
      <circle cx="120" cy="34" r="6" fill="var(--clay)" className="field-breathe" />
      <line x1="120" y1="40" x2="120" y2="46" stroke="var(--blue)" />
      <circle cx="98" cy="76" r="7" fill="var(--slate)" />
      <circle cx="142" cy="76" r="7" fill="var(--slate)" />
      <g key={stage}>
        {bars.map((height, i) => {
          const x = 74 + i * 15;
          const h = height * (0.55 + ((stage + i) % 3) * 0.22);
          return (
            <line
              key={i}
              x1={x}
              y1={112 - h / 2}
              x2={x}
              y2={112 + h / 2}
              stroke="var(--blue)"
              strokeOpacity="0.7"
              strokeLinecap="round"
              strokeWidth="2"
              className="wave-bar"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          );
        })}
      </g>
    </svg>
  );
}

