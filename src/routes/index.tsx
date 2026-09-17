import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Body,
  ChoiceCard,
  CompanionIntroOverlay,
  HelpOverlay,
  PortalOption,
  PrimaryAction,
  QuietAction,
  Screen,
  SecondaryAction,
  SoundControl,
  StackedOption,
  Title,
} from "@/components/soma/Shell";
import {
  ColourChoices,
  CompanionTraceOverlay,
  ConfirmRow,
  TraceCollection,
  TraceMark,
  WordChoices,
} from "@/components/soma/Trace";
import { SCENE_PHASES, SceneStage, scenePhaseCopy } from "@/components/soma/Scene";
import { FieldNoteContent } from "@/components/soma/FieldNote";
import shareImage from "@/assets/field/soma-field-share-v2.jpg.asset.json";
import {
  artwork,
  sceneStages,
  screens,
  START,
  type SceneKey,
  type TraceColourKey,
} from "@/lib/soma/screens";
import { releaseTones, soundSupported, startSound, stopSound } from "@/lib/soma/audio";
import {
  addTrace,
  clearTraces,
  createTrace,
  readTraces,
  removeTraceById,
  type Trace,
} from "@/lib/soma/traces";

const title = "SOMA FIELD — a quiet sensory interface";
const description =
  "SOMA FIELD is a calm, tactile prototype that offers one sensory invitation at a time: rain and light at a window, faded yellow cloth, or a loose thread to guide.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://soma.work-jiangnan.com/" },
      { property: "og:image", content: `https://soma.work-jiangnan.com${shareImage.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `https://soma.work-jiangnan.com${shareImage.url}` },
    ],
  }),
  component: SomaField,
});

function SomaField() {
  const [id, setId] = useState(START);
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [companionIntroOpen, setCompanionIntroOpen] = useState(false);
  /** The field note opens over the journey, so the sensory state is untouched. */
  const [noteOpen, setNoteOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [soundPending, setSoundPending] = useState(false);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [kept, setKept] = useState<Trace[]>([]);
  const [nearby, setNearby] = useState<string>("");
  /** Which sensory world the visitor is in, so a kept trace can replay it. */
  const [scene, setScene] = useState<SceneKey>("cloth");
  /** ARRIVE → RESPOND → REST inside one continuous scene. 3 is the settled end. */
  const [scenePhase, setScenePhase] = useState(0);
  const [pendingColour, setPendingColour] = useState<TraceColourKey | null>(null);
  /** Which kept trace is being met again, and whether a quiet action is asking. */
  const [openTrace, setOpenTrace] = useState<string | null>(null);
  const [companionTrace, setCompanionTrace] = useState<Trace | null>(null);
  const [asking, setAsking] = useState(false);
  const selectTimer = useRef<number | null>(null);
  const sceneTouches = useRef(0);

  const screen = screens[id]!;
  const sceneKey = screen.sceneStage;
  const stageCount = screen.stages?.length ?? 1;
  const activeStage = screen.stages ? stage % stageCount : 0;
  const overlay = screen.stages?.[activeStage] ?? {};

  const returning = kept.length > 0;
  const sceneCopy = sceneKey ? scenePhaseCopy(sceneKey, scenePhase) : null;
  const resting = sceneCopy?.resting ?? false;

  const eyebrow = sceneCopy ? sceneCopy.eyebrow : (overlay.eyebrow ?? screen.eyebrow);
  const heading =
    id === "choice" && returning
      ? "What feels right today?"
      : (overlay.title ?? screen.title);
  const bodyText = overlay.body ?? screen.body;
  const footnote = sceneKey
    ? undefined
    : id === START && returning
      ? kept.length === 1
        ? "One trace is waiting here."
        : `${kept.length} traces are waiting here.`
      : (overlay.footnote ?? screen.footnote);

  const recalled = openTrace === null ? null : (kept.find((item) => item.id === openTrace) ?? null);
  const shownTrace = screen.replay ? recalled : trace;
  const keepScreens = new Set(["traceColour", "traceWord", "kept", "traces", "recall"]);
  const phase = sceneKey
    ? resting
      ? "KEEP"
      : "NOTICE"
    : keepScreens.has(id)
      ? "KEEP"
      : "CHOOSE";

  /** A kept trace opens again inside its own scene: window, cloth or thread. */
  const replayArt =
    shownTrace?.scene === "window"
      ? "windowRecall"
      : shownTrace?.scene === "thread"
        ? "threadRest"
        : "embrace";
  const artKey = screen.replay ? replayArt : screen.art;
  const Art = artKey ? artwork[artKey] : null;
  const soundAvailable = screen.sound === "off" || screen.sound === "on" ? soundSupported() : false;

  useEffect(() => {
    setKept(readTraces());
  }, []);

  /** What was nearby comes from the live scene moment, never from a guess. */
  useEffect(() => {
    if (sceneCopy) setNearby(sceneCopy.nearby);
  }, [sceneCopy?.nearby]);

  const silence = useCallback(() => {
    stopSound();
    releaseTones();
    setSoundOn(false);
    setSoundPending(false);
  }, []);

  useEffect(
    () => () => {
      stopSound();
      releaseTones();
    },
    [],
  );

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") silence();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [silence]);

  const go = useCallback(
    (next: string) => {
      setSelected(null);
      setHelpOpen(false);
      setAsking(false);
      if (next === id) {
        // Same state: advance the object instead of pushing more history.
        setStage((value) => value + 1);
        return;
      }
      silence();
      setStage(0);
      setScenePhase(0);
      sceneTouches.current = 0;
      const arriving = screens[next]?.nearby;
      if (arriving) setNearby(arriving);
      const world = screens[next]?.scene;
      if (world) setScene(world);
      setHistory((previous) => [...previous.slice(-24), id]);
      setId(next);
    },
    [id, silence],
  );

  /** The scene moves on: by the fallback button, or by staying with the touch. */
  const advanceScene = useCallback(() => {
    sceneTouches.current = 0;
    setScenePhase((value) => Math.min(SCENE_PHASES, value + 1));
  }, []);

  const onSceneTouch = useCallback(() => {
    sceneTouches.current += 1;
    if (sceneTouches.current >= 4) advanceScene();
  }, [advanceScene]);

  const choose = (option: { title: string; to: string }) => {
    setSelected(option.title);
    if (selectTimer.current) window.clearTimeout(selectTimer.current);
    // Let the chosen object respond before the page changes.
    selectTimer.current = window.setTimeout(() => go(option.to), 520);
  };

  /** Two one-tap steps: a colour, then a word. */
  const pickColour = (option: { label: string; colour: TraceColourKey }) => {
    setSelected(option.label);
    setPendingColour(option.colour);
    if (selectTimer.current) window.clearTimeout(selectTimer.current);
    selectTimer.current = window.setTimeout(() => go("traceWord"), 520);
  };

  const pickWord = (option: { label: string }) => {
    setSelected(option.label);
    const colour = pendingColour ?? trace?.colour ?? "blue";
    // One canonical trace object. Every later screen renders from exactly this.
    const next = createTrace({
      scene,
      colour,
      word: option.label,
      nearby: nearby || "A quiet moment",
    });
    setTrace(next);
    setOpenTrace(next.id);
    setKept(addTrace(next));
    if (selectTimer.current) window.clearTimeout(selectTimer.current);
    selectTimer.current = window.setTimeout(() => go("kept"), 520);
  };

  useEffect(
    () => () => {
      if (selectTimer.current) window.clearTimeout(selectTimer.current);
    },
    [],
  );

  const toggleSound = async () => {
    const kind = sceneKey ? sceneStages[sceneKey].soundKind : (screen.soundKind ?? "rain");
    if (soundOn) {
      silence();
      return;
    }
    setSoundPending(true);
    const started = await startSound(kind);
    setSoundPending(false);
    setSoundOn(started);
  };

  /** "Remove this trace" / "Take them all away" / "Remove this one". */
  const runQuiet = () => {
    const quiet = screen.quiet;
    if (!quiet) return;
    if (screen.replay) {
      if (openTrace !== null) setKept(removeTraceById(openTrace));
      setOpenTrace(null);
    } else if (screen.collection) {
      clearTraces();
      setKept([]);
      setTrace(null);
      setPendingColour(null);
    } else if (screen.showTrace) {
      // The trace just kept: remove only that one.
      if (trace) setKept(removeTraceById(trace.id));
      setTrace(null);
      setPendingColour(null);
    } else if (screen.pick) {
      setTrace(null);
      setPendingColour(null);
    }
    go(quiet.to);
  };

  const back =
    history.length > 0
      ? () => {
          setSelected(null);
          setHelpOpen(false);
          setAsking(false);
          silence();
          setStage(0);
          setScenePhase(0);
          sceneTouches.current = 0;
          setId(history[history.length - 1]!);
          setHistory((previous) => previous.slice(0, -1));
        }
      : undefined;

  const openNote = () => {
    silence();
    setHelpOpen(false);
    setCompanionIntroOpen(false);
    setNoteOpen(true);
  };

  return (
    <>
      <Screen
        surface={screen.surface}
        eyebrow={eyebrow}
        phase={phase}
        footnote={footnote}
        onBack={back}
        onHelp={() => setHelpOpen(true)}
        hideHelp={id === START}
      >

        <div key={id} className="screen-enter flex flex-1 flex-col">
          {sceneKey ? (
            <SceneStage scene={sceneKey} phase={scenePhase} onTouch={onSceneTouch} />
          ) : screen.pick ? (
            <>
              <div className="pt-8 text-center">
                <Title>{heading}</Title>
                {bodyText ? <Body>{bodyText}</Body> : null}
              </div>
              {screen.pick.kind === "colour" ? (
                <ColourChoices
                  options={screen.pick.options}
                  selected={selected}
                  onPick={pickColour}
                />
              ) : (
                <WordChoices
                  options={screen.pick.options}
                  selected={selected}
                  colour={pendingColour}
                  onPick={pickWord}
                />
              )}
            </>
          ) : screen.choices ? (
            <>
              <div className="pt-8 text-center">
                <Title>{heading}</Title>
                {bodyText ? <Body>{bodyText}</Body> : null}
              </div>

              {screen.choices.kind === "cards" ? (
                <div className="mt-8 flex gap-3 sm:mt-9 sm:gap-4">
                  {screen.choices.options.map((option) => {
                    const OptionArt = option.art ? artwork[option.art] : null;
                    return (
                      <ChoiceCard
                        key={option.title}
                        title={option.title}
                        subtitle={option.subtitle}
                        selected={selected === option.title}
                        onClick={() => choose(option)}
                        art={OptionArt ? <OptionArt className="h-24 w-24 sm:h-28 sm:w-28" /> : null}
                      />
                    );
                  })}
                </div>
              ) : screen.choices.kind === "portals" ? (
                <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:gap-4">
                  {screen.choices.options.map((option) => {
                    const OptionArt = option.art ? artwork[option.art] : null;
                    return (
                      <PortalOption
                        key={option.title}
                        title={option.title}
                        subtitle={option.subtitle}
                        selected={selected === option.title}
                        onClick={() => choose(option)}
                        art={OptionArt ? <OptionArt className="size-full" /> : null}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="mt-8 flex flex-col gap-4 sm:mt-9">
                  {screen.choices.options.map((option) => (
                    <StackedOption
                      key={option.title}
                      title={option.title}
                      subtitle={option.subtitle}
                      selected={selected === option.title}
                      onClick={() => choose(option)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : screen.collection ? (
            <>
              <div className="pt-8 text-center">
                <Title>{heading}</Title>
                {bodyText ? <Body>{bodyText}</Body> : null}
              </div>
              <TraceCollection
                traces={kept}
                onOpen={(item) => {
                  setOpenTrace(item.id);
                  go("recall");
                }}
                onCompanion={(item) => setCompanionTrace(item)}
              />
            </>
          ) : (
            <>
              {Art ? (
                <div
                  className={`mt-8 grid place-items-center transition-colors duration-700 ${
                    screen.artFramed || screen.replay
                      ? "rounded-card bg-field px-5 py-7 sm:px-6 sm:py-8"
                      : ""
                  }`}
                >
                  <Art className="h-48 w-full max-w-[280px] sm:h-56" stage={activeStage} />
                </div>
              ) : null}

              <div key={`${id}-${activeStage}`} className="stage-enter mt-9 text-center sm:mt-10">
                {screen.atmosphere ? (
                  <p className="mb-3 text-[0.9375rem] leading-snug text-faint">
                    {screen.atmosphere}
                  </p>
                ) : null}
                <Title>{heading}</Title>
                {bodyText
                  ? bodyText
                      .split("\n")
                      .map((line, index) =>
                        id === START && index === 1 ? (
                          <p
                            key={line}
                            className="mt-3 text-[0.9375rem] leading-relaxed text-faint"
                          >
                            {line}
                          </p>
                        ) : (
                          <Body key={line}>{line}</Body>
                        ),
                      )
                  : null}
                {screen.echo ? (
                  <p className="mt-5 font-display text-[1.2rem] leading-snug text-clay">
                    {screen.echo}
                  </p>
                ) : null}
                {screen.showTrace && shownTrace ? (
                  <TraceMark
                    trace={shownTrace}
                    onCompanion={() => setCompanionTrace(shownTrace)}
                  />
                ) : null}
              </div>
            </>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-9 sm:gap-4 sm:pt-10">
            {screen.sound ? (
              <SoundControl
                on={soundOn}
                available={soundAvailable}
                pending={soundPending}
                onToggle={() => void toggleSound()}
              />
            ) : null}

            {sceneKey ? (
              <>
                {resting ? (
                  <>
                    <PrimaryAction
                      label="Keep a colour and a word"
                      onClick={() => go("traceColour")}
                    />
                    <SecondaryAction
                      label="Finish without saving"
                      onClick={() => go("choice")}
                    />
                  </>
                ) : (
                  <PrimaryAction label={sceneStages[sceneKey].fallback} onClick={advanceScene} />
                )}
                <div className="pt-1 sm:pt-2">
                  <QuietAction label="Stop" onClick={() => go("rest")} />
                </div>
              </>
            ) : (
              <>
                {screen.primary ? (
                  <PrimaryAction
                    label={id === START && returning ? "Begin today" : screen.primary.label}
                    onClick={() => go(screen.primary!.to)}
                  />
                ) : null}
                {screen.secondary ? (
                  <SecondaryAction
                    label={screen.secondary.label}
                    onClick={() => go(screen.secondary!.to)}
                  />
                ) : null}
                {id === START ? (
                  <div className="flex flex-col gap-1 pt-1 sm:pt-2">
                    <QuietAction label="How it works" onClick={() => setHelpOpen(true)} />
                    <QuietAction
                      label="For companions and reviewers"
                      onClick={() => setCompanionIntroOpen(true)}
                    />
                  </div>
                ) : null}
                {(id === "choice" || screen.viewTraces) && kept.length > 0 ? (
                  <div className="pt-1">
                    <QuietAction label="What I kept before" onClick={() => go("traces")} />
                  </div>
                ) : null}
                {screen.quiet && !(screen.collection && kept.length === 0) ? (
                  asking && screen.confirmQuiet ? (
                    <ConfirmRow
                      question={screen.confirmQuiet.question}
                      keepLabel={screen.confirmQuiet.keep}
                      goLabel={screen.confirmQuiet.go}
                      onKeep={() => setAsking(false)}
                      onGo={runQuiet}
                    />
                  ) : (
                    <div className="pt-1 sm:pt-2">
                      <QuietAction
                        label={screen.quiet.label}
                        onClick={() => {
                          if (screen.confirmQuiet) {
                            setAsking(true);
                            return;
                          }
                          runQuiet();
                        }}
                      />
                    </div>
                  )
                ) : null}
                {screen.note ? (
                  <p className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={openNote}
                      className="min-h-12 px-2 text-base text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-foreground"
                    >
                      Field Note
                    </button>
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </Screen>

      {helpOpen ? (
        <HelpOverlay
          surface={screen.surface}
          onClose={() => setHelpOpen(false)}
          onCompanion={() => {
            setHelpOpen(false);
            setCompanionIntroOpen(true);
          }}
          onFieldNote={openNote}
        />
      ) : null}

      {companionIntroOpen ? (
        <CompanionIntroOverlay
          onClose={() => setCompanionIntroOpen(false)}
          onFieldNote={openNote}
        />
      ) : null}
      {companionTrace ? (
        <CompanionTraceOverlay trace={companionTrace} onClose={() => setCompanionTrace(null)} />
      ) : null}

      {noteOpen ? (
        <div className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain">
          <FieldNoteContent
            onReturn={
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                className="inline-flex min-h-12 items-center rounded-pill border border-hairline px-5 text-base text-foreground transition-colors duration-300 hover:border-foreground"
              >
                Back to SOMA FIELD
              </button>
            }
          />
        </div>
      ) : null}
    </>
  );
}
