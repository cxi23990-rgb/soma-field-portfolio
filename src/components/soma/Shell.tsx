import type { ReactNode } from "react";
import { useDialogBehaviour } from "@/components/soma/dialog";

import windowDaylight from "@/assets/field/IMG_0146.jpg.asset.json";
import clothCrop from "@/assets/field/cloth_yellow_bedding_privacy_crop_v2.jpg.asset.json";
import threadCrop from "@/assets/field/thread_work_surface_privacy_crop.jpg.asset.json";

/** Three real field images, chosen from the existing documentation only. */
const originThumbnails = [
  {
    src: windowDaylight.url,
    alt: "Diffused daylight and curtain movement in a care setting window.",
  },
  {
    src: clothCrop.url,
    alt: "Privacy-cropped view of faded yellow bedding with handmade textile edging.",
  },
  {
    src: threadCrop.url,
    alt: "Privacy-cropped work surface with yarn and crocheted objects.",
  },
];

type Surface = "slate" | "ivory";


/** Oversized contours behind the app column — only visible on wide screens. */
function AmbientField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="size-full opacity-[0.14]"
      >
        <g fill="none" stroke="var(--foreground)" strokeWidth="1">
          <circle cx="180" cy="240" r="360" strokeOpacity="0.5" />
          <circle cx="180" cy="240" r="520" strokeOpacity="0.3" />
          <circle cx="1440" cy="720" r="420" strokeOpacity="0.45" />
          <circle cx="1440" cy="720" r="600" strokeOpacity="0.22" />
          <path d="M0 640c260 60 420-40 640-16s360 120 620 74" strokeOpacity="0.35" />
          <path d="M0 700c260 60 420-40 640-16s360 120 620 74" strokeOpacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

export type Phase = "CHOOSE" | "NOTICE" | "KEEP";

const phases: Phase[] = ["CHOOSE", "NOTICE", "KEEP"];

/** Three quiet words on a thin line. Only the current one is lit. */
function PhaseTrail({ phase }: { phase: Phase }) {
  return (
    <p
      className="flex items-center justify-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.14em]"
      aria-label={`Stage: ${phase.toLowerCase()} of choose, notice, keep`}
    >
      {phases.map((item, index) => (
        <span key={item} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="block h-px w-3 bg-current opacity-25" />
          ) : null}
          <span className={item === phase ? "text-foreground" : "text-faint opacity-55"}>
            {item}
          </span>
        </span>
      ))}
    </p>
  );
}

export function Screen({
  surface,
  eyebrow,
  phase,
  footnote,
  onBack,
  onHelp,
  hideHelp,
  children,
}: {
  surface: Surface;
  eyebrow: string;
  phase?: Phase | undefined;
  footnote?: string | undefined;
  onBack?: (() => void) | undefined;
  onHelp: () => void;
  /** The opening screen offers the plain "How it works" text action instead. */
  hideHelp?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div
      data-surface={surface}
      className="relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground transition-colors duration-700"
    >
      <AmbientField />
      <div aria-hidden="true" className="soma-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-5 pb-8 pt-6 sm:px-6">
        <header className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 flex min-h-12 items-center rounded-pill px-2 text-left text-base text-muted-foreground transition-colors duration-300 hover:text-foreground active:opacity-70"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <div className="text-center">
            {phase ? <PhaseTrail phase={phase} /> : null}
            <p className="mt-1 text-[0.9375rem] leading-snug text-muted-foreground">{eyebrow}</p>
          </div>
          {hideHelp ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={onHelp}
              aria-label="How it works"
              className="ml-auto grid size-12 shrink-0 place-items-center rounded-full border border-foreground/60 text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground/10 active:opacity-70"
            >
              <span
                aria-hidden="true"
                className="block text-lg font-medium leading-none tracking-normal"
              >
                ?
              </span>
            </button>
          )}
        </header>


        <main className="flex flex-1 flex-col">{children}</main>

        {footnote ? (
          <p className="pt-6 text-center text-sm leading-relaxed text-balance text-muted-foreground">
            {footnote}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[2.15rem] leading-[1.12] tracking-[-0.01em] text-balance sm:text-[2.45rem]">
      {children}
    </h1>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
      {children}
    </p>
  );
}

export function PrimaryAction({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-pill bg-action px-6 py-5 text-lg font-medium text-action-foreground transition-all duration-[400ms] hover:opacity-90 active:scale-[0.985] active:opacity-80 disabled:pointer-events-none disabled:opacity-40"
    >
      {label}
    </button>
  );
}

export function SecondaryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-pill border border-hairline px-6 py-5 text-lg text-foreground transition-all duration-[400ms] hover:border-foreground active:scale-[0.985] active:opacity-75"
    >
      {label}
    </button>
  );
}

export function QuietAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto block min-h-12 border-b border-hairline px-2 pb-1 text-base text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground active:opacity-70"
    >
      {label}
    </button>
  );
}

export function ChoiceCard({
  title,
  subtitle,
  art,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  art: ReactNode;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${subtitle}`}
      data-selected={selected ? "true" : undefined}

      className={`flex flex-1 flex-col rounded-card border bg-card p-4 pb-6 text-left transition-all duration-500 active:scale-[0.99] sm:p-5 sm:pb-7 ${
        selected
          ? "border-clay shadow-[0_0_0_1px_var(--clay)]"
          : "border-transparent hover:border-hairline"
      }`}
    >
      <div className={`grid h-28 place-items-center sm:h-32 ${selected ? "choice-respond" : ""}`}>
        {art}
      </div>
      <h2 className="mt-4 font-display text-xl leading-tight text-card-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
    </button>
  );
}

/**
 * A nearby sensory invitation: a large moving cue beside a short name.
 * Three of these sit together as three doorways, never as a feature menu.
 */
export function PortalOption({
  title,
  subtitle,
  art,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  art: ReactNode;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${subtitle}`}

      className={`flex w-full items-center gap-4 rounded-card border bg-card p-4 text-left transition-all duration-500 active:scale-[0.995] sm:gap-5 sm:p-5 ${
        selected
          ? "border-clay shadow-[0_0_0_1px_var(--clay)]"
          : "border-hairline hover:border-foreground"
      }`}
    >
      <span
        className={`grid size-[5.5rem] shrink-0 place-items-center overflow-hidden rounded-card bg-field sm:size-24 ${
          selected ? "choice-respond" : ""
        }`}
      >
        {art}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-2xl leading-tight text-card-foreground">
          {title}
        </span>
        <span className="mt-1 block text-[0.9375rem] leading-snug text-muted-foreground text-pretty">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export function StackedOption({

  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${subtitle}`}
      className={`w-full rounded-card border p-5 text-left transition-all duration-500 active:scale-[0.995] sm:p-6 ${
        selected
          ? "border-clay bg-slate text-ivory"
          : "border-hairline bg-card text-card-foreground hover:border-foreground"
      }`}
    >
      <h2 className="font-display text-xl leading-tight sm:text-2xl">{title}</h2>
      <p
        className={`mt-2 text-[0.9375rem] leading-relaxed text-pretty sm:text-base ${
          selected ? "text-mist" : "text-muted-foreground"
        }`}
      >
        {subtitle}
      </p>
    </button>
  );
}

/** One short sheet for both audiences. It fits a 390×844 screen. */
export function HelpOverlay({
  surface,
  onClose,
  onCompanion,
  onFieldNote,
}: {
  surface: Surface;
  onClose: () => void;
  onCompanion: () => void;
  onFieldNote: () => void;
}) {
  const panel = useDialogBehaviour<HTMLDivElement>(onClose);
  return (
    <div
      data-surface={surface}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate/70 px-5 py-8 sm:px-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="How it works"
      onClick={onClose}
    >
      <div
        ref={panel}
        tabIndex={-1}
        className="screen-enter my-auto w-full max-w-[430px] rounded-card bg-background p-6 text-foreground outline-none sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >

        <p className="text-sm text-muted-foreground">SOMA FIELD</p>
        <h2 className="mt-2 font-display text-2xl leading-tight">How it works</h2>

        <section className="mt-6 border-t border-hairline pt-5">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
            For the person
          </h3>
          <ul className="mt-3 space-y-1.5 text-base leading-relaxed text-foreground">
            <li>Choose one nearby thing.</li>
            <li>Notice whatever feels familiar.</li>
            <li>Keep a colour and a word — or leave nothing.</li>
          </ul>
        </section>

        <section className="mt-6 border-t border-hairline pt-5">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
            For a companion
          </h3>
          <ul className="mt-3 space-y-1.5 text-base leading-relaxed text-muted-foreground">
            <li>Offer one gentle cue without testing recall.</li>
            <li>Wait before repeating or explaining.</li>
            <li>
              On another day, offer the chosen cue again without asking the person to remember the
              earlier encounter.
            </li>
          </ul>
        </section>

        <p className="mt-6 border-t border-hairline pt-5 text-sm leading-relaxed text-muted-foreground">
          Saved traces stay on this device. They are preference traces, not assessments or
          diagnoses.
        </p>

        <div className="mt-6">
          <PrimaryAction label="Close" onClick={onClose} />
        </div>
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          <button
            type="button"
            onClick={onCompanion}
            className="min-h-12 px-2 text-base text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-foreground"
          >
            Design origin
          </button>
          <button
            type="button"
            onClick={onFieldNote}
            className="min-h-12 px-2 text-base text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-foreground"
          >
            Field Note · The Hands Remember
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Design origin — for companions and portfolio reviewers only. It is reached
 * from How it works or the Field Note, never from inside an encounter.
 */
export function CompanionIntroOverlay({
  onClose,
  onFieldNote,
}: {
  onClose: () => void;
  onFieldNote?: (() => void) | undefined;
}) {
  const panel = useDialogBehaviour<HTMLDivElement>(onClose);
  return (
    <div
      data-surface="ivory"
      className="fixed inset-0 z-[55] flex items-end justify-center overflow-y-auto bg-slate/70 px-5 py-8 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-intro-title"
      onClick={onClose}
    >
      <div
        ref={panel}
        tabIndex={-1}
        className="screen-enter my-auto w-full max-w-[430px] rounded-card bg-background p-6 text-foreground outline-none sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >

        <p className="text-sm text-muted-foreground">For companions and reviewers</p>
        <h2 id="companion-intro-title" className="mt-2 font-display text-2xl leading-tight">
          Design origin
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          SOMA FIELD is a calm sensory companion for people living with memory change. It does not
          test recall or ask for a correct story. It offers a gentle cue and records only what the
          person chooses to stay with.
        </p>

        <section className="mt-6 border-t border-hairline pt-5">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-faint">Observed</h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Familiar objects, repeated hand movements and sensory cues observed in the care
            environment.
          </p>
        </section>
        <section className="mt-5 border-t border-hairline pt-5">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
            Remembered by the body
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            The Flower Aunt story, and the insight that practiced gestures may remain meaningful
            even when names and explanations become difficult.
          </p>
        </section>
        <section className="mt-5 border-t border-hairline pt-5">
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
            Translated into the interface
          </h3>
          <ul className="mt-2 space-y-1 text-base leading-relaxed text-muted-foreground">
            <li>Window → changing light and weather</li>
            <li>Cloth → smoothing, folding and holding</li>
            <li>Thread → looping, making and leaving something unfinished</li>
            <li>Trace → a preference that can be offered again without testing recall</li>
          </ul>
        </section>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {originThumbnails.map((item) => (
            <figure key={item.src}>
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                width={640}
                height={480}
                className="aspect-[4/3] w-full rounded-card border border-hairline object-cover"
              />
            </figure>
          ))}
        </div>

        <p className="mt-6 border-l-2 border-clay pl-4 text-base leading-relaxed text-foreground">
          A saved trace is a preference trace, not an assessment or diagnosis.
        </p>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Field documentation is presented with identifying details removed. These observations are
          qualitative and are not clinical evidence.
        </p>

        {onFieldNote ? (
          <div className="mt-7">
            <PrimaryAction label="Open the full Field Note" onClick={onFieldNote} />
          </div>
        ) : null}
        <p className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 px-2 text-base text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-foreground"
          >
            Close
          </button>
        </p>
      </div>
    </div>
  );
}


export function SoundControl({
  on,
  available,
  pending,
  onToggle,
}: {
  on: boolean;
  available: boolean;
  pending?: boolean;
  onToggle: () => void;
}) {
  const label = !available
    ? "Sound is not available here"
    : pending
      ? "Sound is starting…"
      : on
        ? "Sound is on — tap to fade out"
        : "Sound is off — tap to fade in";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!available || pending}
      aria-pressed={available ? on : undefined}
      className="mx-auto flex min-h-12 items-center gap-3 rounded-pill border border-hairline px-5 text-[0.9375rem] text-muted-foreground transition-all duration-300 hover:border-foreground active:opacity-75 disabled:pointer-events-none disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full transition-all duration-500 ${
          on ? "bg-clay field-breathe" : "bg-current opacity-40"
        }`}
      />
      {label}
    </button>
  );
}
