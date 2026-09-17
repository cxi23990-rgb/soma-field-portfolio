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
/** A single held disc — the light trace that may be kept. */
export function TraceForm({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 160" className={className} role="presentation" aria-hidden="true">
      <circle cx="80" cy="80" r="62" fill="var(--blue)" className="field-breathe" />
      <circle cx="80" cy="80" r="22" fill="var(--mist)" />
    </svg>
  );
}
