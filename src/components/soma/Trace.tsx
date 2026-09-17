import { useDialogBehaviour } from "@/components/soma/dialog";
import type { SceneKey, TraceColourKey } from "@/lib/soma/screens";
import { COLOUR_LABELS, SCENE_LABELS, type Trace } from "@/lib/soma/traces";


const colourToken: Record<TraceColourKey, string> = {
  blue: "var(--blue)",
  clay: "var(--clay)",
  mist: "var(--mist)",
};

/** Which world a kept trace came from — a place, never a category. */
export const sceneLabel = SCENE_LABELS;
export const colourLabel = COLOUR_LABELS;

export function SceneThumbnail({ scene }: { scene: SceneKey }) {
  return (
    <svg viewBox="0 0 56 56" className="size-14" aria-hidden="true">
      {scene === "window" ? (
        <>
          <rect x="9" y="8" width="38" height="34" fill="none" stroke="var(--blue)" />
          <path d="M28 8v34M9 25h38M15 48c10-5 21-5 31 0" fill="none" stroke="var(--clay)" />
        </>
      ) : scene === "thread" ? (
        <path
          d="M5 39c10 3 11-15 22-15 9 0 8 13 17 13 5 0 7-5 9-10"
          fill="none"
          stroke="var(--clay)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path d="M8 20c12-6 29-6 40 0l-4 25c-11-5-22-5-33 0z" fill="var(--linen)" stroke="var(--clay)" />
      )}
    </svg>
  );
}

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
    <div className="mt-9 flex gap-3 sm:gap-4" role="radiogroup" aria-label="Choose a colour">
      {options.map((option) => {
        const active = selected === option.label;
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onPick(option)}
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
  colour,
  onPick,
}: {
  options: { label: string }[];
  selected?: string | null;
  /** The colour already chosen stays visibly present while the word is picked. */
  colour?: TraceColourKey | null;
  onPick: (option: { label: string }) => void;
}) {
  return (
    <>
      {colour ? (
        <p className="mt-7 flex items-center justify-center gap-3 text-[0.9375rem] text-muted-foreground">
          <span
            aria-hidden="true"
            className="field-breathe block size-10 rounded-full"
            style={{ backgroundColor: colourToken[colour] }}
          />
          {COLOUR_LABELS[colour]} is held
        </p>
      ) : null}
      <div
        className="mt-7 flex flex-col gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Choose a word"
      >
        {options.map((option) => {
          const active = selected === option.label;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onPick(option)}
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
    </>
  );
}

/**
 * The kept trace, assembled from the encounter: the scene mark, the chosen
 * colour, the chosen word and what was nearby. Every value comes from the one
 * saved object — nothing here is inferred.
 */
export function TraceMark({
  trace,
  onReplay,
  onCompanion,
}: {
  trace: Trace;
  onReplay?: (() => void) | undefined;
  onCompanion?: (() => void) | undefined;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <span className="grid size-16 place-items-center rounded-card bg-field">
        <SceneThumbnail scene={trace.scene} />
      </span>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
        {trace.sceneLabel}
      </p>
      <div className="flex items-center justify-center gap-4">
        <span
          aria-hidden="true"
          className="field-breathe block size-14 rounded-full"
          style={{ backgroundColor: colourToken[trace.colour] }}
        />
        <span className="font-display text-2xl text-foreground">
          {`${trace.colourLabel} · ${trace.word}`}

        </span>
      </div>
      {trace.nearby ? (
        <span className="text-[1.0625rem] leading-snug text-muted-foreground">{trace.nearby}</span>
      ) : null}
      {onReplay || onCompanion ? (
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {onReplay ? (
            <button
              type="button"
              onClick={onReplay}
              className="min-h-12 text-base text-foreground underline decoration-hairline underline-offset-4"
            >
              Replay this encounter
            </button>
          ) : null}
          {onCompanion ? (
            <button
              type="button"
              onClick={onCompanion}
              className="min-h-12 text-base text-foreground underline decoration-hairline underline-offset-4"
            >
              Companion view
            </button>
          ) : null}
        </div>
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
  onCompanion,
}: {
  traces: Trace[];
  onOpen?: (trace: Trace) => void;
  onCompanion?: (trace: Trace) => void;
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

  const groups: SceneKey[] = ["window", "cloth", "thread"];
  return (
    <div className="mt-8 space-y-9">
      {groups.map((scene) => {
        const items = traces.filter((trace) => trace.scene === scene);
        if (items.length === 0) return null;
        return (
          <section key={scene} aria-labelledby={`trace-group-${scene}`}>
            <h2
              id={`trace-group-${scene}`}
              className="text-xs font-medium uppercase tracking-[0.12em] text-faint"
            >
              {SCENE_LABELS[scene]}
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {items.map((trace) => (
                <li key={trace.id} className="rounded-card border border-hairline p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid size-16 shrink-0 place-items-center rounded-card bg-field">
                      <SceneThumbnail scene={trace.scene} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
                        {trace.sceneLabel}
                      </p>
                      <p className="mt-1 font-display text-xl leading-tight text-foreground">
                        {`${trace.colourLabel} · ${trace.word}`}
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {trace.nearby}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-hairline pt-3">
                    <button
                      type="button"
                      onClick={() => onOpen?.(trace)}
                      className="min-h-12 text-left text-[0.9375rem] text-foreground underline decoration-hairline underline-offset-4"
                    >
                      Replay this encounter
                    </button>
                    <button
                      type="button"
                      onClick={() => onCompanion?.(trace)}
                      className="min-h-12 text-left text-[0.9375rem] text-foreground underline decoration-hairline underline-offset-4"
                    >
                      Companion view
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function CompanionTraceOverlay({
  trace,
  onClose,
}: {
  trace: Trace;
  onClose: () => void;
}) {
  const panel = useDialogBehaviour<HTMLDivElement>(onClose);
  return (
    <div
      data-surface="ivory"
      className="fixed inset-0 z-[58] flex items-end justify-center bg-slate/70 px-5 pb-8 sm:items-center sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-trace-title"
      onClick={onClose}
    >
      <div
        ref={panel}
        tabIndex={-1}
        className="screen-enter w-full max-w-[430px] rounded-card bg-background p-6 text-foreground outline-none sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm text-muted-foreground">{`Companion view · ${trace.sceneLabel}`}</p>
        <h2 id="companion-trace-title" className="mt-2 font-display text-2xl leading-tight">
          A preference trace, not an assessment.
        </h2>
        <div className="mt-5 flex items-center gap-4 rounded-card bg-field p-4">
          <SceneThumbnail scene={trace.scene} />
          <p className="text-base leading-relaxed">
            {`Today, ${trace.colourLabel} and the word “${trace.word}” were chosen during the ${trace.sceneLabel} encounter.`}
          </p>
        </div>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          On another day, offer the same invitation again without asking the person to remember or
          explain the earlier choice.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This view stays on this device. Nothing is sent or uploaded.
        </p>
        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-pill bg-action px-6 py-5 text-lg font-medium text-action-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
