import type { ReactNode } from "react";

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

export function Screen({
  surface,
  eyebrow,
  footnote,
  onBack,
  onHelp,
  children,
}: {
  surface: Surface;
  eyebrow: string;
  footnote?: string | undefined;
  onBack?: (() => void) | undefined;
  onHelp: () => void;
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
          <p className="text-center text-[0.9375rem] leading-snug text-muted-foreground">
            {eyebrow}
          </p>
          <button
            type="button"
            onClick={onHelp}
            aria-label="What is on this screen?"
            className="ml-auto grid size-12 shrink-0 place-items-center rounded-full border border-foreground/60 text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground/10 active:opacity-70"
          >
            <span
              aria-hidden="true"
              className="block text-lg font-medium leading-none tracking-normal"
            >
              ?
            </span>
          </button>
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
      aria-pressed={selected}
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
      aria-pressed={selected}
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
      aria-pressed={selected}
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

export function HelpOverlay({
  surface,
  eyebrow,
  text,
  onClose,
}: {
  surface: Surface;
  eyebrow: string;
  text: string;
  onClose: () => void;
}) {
  return (
    <div
      data-surface={surface}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate/70 px-5 pb-8 sm:px-6 sm:pb-10"
      role="dialog"
      aria-modal="true"
      aria-label="About this screen"
      onClick={onClose}
    >
      <div
        className="screen-enter w-full max-w-[430px] rounded-card bg-background p-6 text-foreground sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl leading-tight">This screen</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty sm:text-[1.0625rem]">
          {text}
        </p>
        <div className="mt-7">
          <PrimaryAction label="Close" onClick={onClose} />
        </div>
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
