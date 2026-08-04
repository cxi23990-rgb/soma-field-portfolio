import type { SceneKey, TraceColourKey } from "@/lib/soma/screens";
import type { Trace } from "@/lib/soma/traces";

const colourToken: Record<TraceColourKey, string> = {
  blue: "var(--blue)",
  clay: "var(--clay)",
  mist: "var(--mist)",
};

/** Which world a kept trace came from — a place, never a category. */
const sceneLabel: Record<SceneKey, string> = {
  window: "Window",
  cloth: "Cloth",
  thread: "Thread",
};



/** Three large colour targets — one tap, no confirmation step. */
export function ColourChoices({
  options,
  selected,
  onPick,
}: {
  options: { label: string; colour: TraceColourKey }[];
  selected?: string | null;
  onPick: (option: { label: string; colour: TraceColourKey }) => void;
}) {
  return (
    <div className="mt-9 flex gap-3 sm:gap-4">
      {options.map((option) => {
        const active = selected === option.label;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onPick(option)}
            aria-pressed={active}
            className={`flex flex-1 flex-col items-center gap-3 rounded-card border p-4 transition-all duration-500 active:scale-[0.99] sm:p-5 ${
              active
                ? "border-clay shadow-[0_0_0_1px_var(--clay)]"
                : "border-hairline hover:border-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className={`block size-16 rounded-full sm:size-20 ${active ? "choice-respond" : ""}`}
              style={{ backgroundColor: colourToken[option.colour] }}
            />
            <span className="text-center text-[0.9375rem] leading-snug text-foreground">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Three short feeling words — no typing anywhere in the trace. */
export function WordChoices({
  options,
  selected,
  onPick,
}: {
  options: { label: string }[];
  selected?: string | null;
  onPick: (option: { label: string }) => void;
}) {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:gap-4">
      {options.map((option) => {
        const active = selected === option.label;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onPick(option)}
            aria-pressed={active}
            className={`w-full rounded-pill border px-6 py-5 font-display text-2xl transition-all duration-500 active:scale-[0.995] ${
              active
                ? "border-clay text-foreground shadow-[0_0_0_1px_var(--clay)]"
                : "border-hairline text-foreground hover:border-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** The kept trace: one colour, one word, and what was nearby. */
export function TraceMark({
  colour,
  word,
  nearby,
}: {
  colour: TraceColourKey;
  word: string;
  nearby?: string;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4">
        <span
          aria-hidden="true"
          className="field-breathe block size-14 rounded-full"
          style={{ backgroundColor: colourToken[colour] }}
        />
        <span className="font-display text-3xl text-foreground">{word}</span>
      </div>
      {nearby ? (
        <span className="text-[1.0625rem] leading-snug text-muted-foreground">{nearby}</span>
      ) : null}
    </div>
  );
}


/** A calm two-step question. Never red, never alarming. */
export function ConfirmRow({
  question,
  keepLabel,
  goLabel,
  onKeep,
  onGo,
}: {
  question: string;
  keepLabel: string;
  goLabel: string;
  onKeep: () => void;
  onGo: () => void;
}) {
  return (
    <div className="stage-enter rounded-card border border-hairline px-5 py-4">
      <p className="text-center text-[1.0625rem] leading-snug text-foreground">{question}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onKeep}
          className="min-h-12 flex-1 rounded-pill border border-hairline px-4 py-3 text-base text-foreground transition-colors duration-300 hover:border-foreground active:opacity-75"
        >
          {keepLabel}
        </button>
        <button
          type="button"
          onClick={onGo}
          className="min-h-12 flex-1 rounded-pill border border-clay px-4 py-3 text-base text-foreground transition-colors duration-300 hover:bg-foreground/10 active:opacity-75"
        >
          {goLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * A small shelf of kept traces. Each one is a remembered atmosphere —
 * a colour, a word, and what was nearby — never a record or a score.
 * Touching one opens it again for a moment.
 */
export function TraceCollection({
  traces,
  onOpen,
}: {
  traces: Trace[];
  onOpen?: (index: number) => void;
}) {
  if (traces.length === 0) {
    return (
      <div className="mt-8 rounded-card border border-hairline px-5 py-8 text-center">
        <span
          aria-hidden="true"
          className="mx-auto block size-12 rounded-full border border-hairline"
        />
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty">
          The shelf is empty. Nothing needs to be put on it.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-3 sm:gap-4">
      {traces.map((trace, index) => (
        <li key={`${trace.colour}-${trace.word}-${trace.nearby}-${index}`}>
          <button
            type="button"
            onClick={() => onOpen?.(index)}
            className="flex w-full items-center gap-4 rounded-card border border-hairline px-5 py-4 text-left transition-all duration-500 hover:border-foreground active:scale-[0.995]"
          >
            <span
              aria-hidden="true"
              className="block size-12 shrink-0 rounded-full"
              style={{ backgroundColor: colourToken[trace.colour], opacity: 1 - index * 0.11 }}
            />
            <span className="min-w-0">
              <span className="block font-display text-2xl leading-tight text-foreground">
                {trace.word}
              </span>
              <span className="mt-1 block text-[0.9375rem] leading-snug text-muted-foreground">
                {sceneLabel[trace.scene ?? "cloth"]} · {trace.nearby}
              </span>
            </span>

          </button>
        </li>
      ))}
    </ul>
  );
}

