import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Body,
  ChoiceCard,
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
  ConfirmRow,
  TraceCollection,
  TraceMark,
  WordChoices,
} from "@/components/soma/Trace";
import { ClothField } from "@/components/soma/Rhythm";
import { ThreadField } from "@/components/soma/Thread";
import { WindowField } from "@/components/soma/Window";
import {
  artwork,
  screens,
  START,
  type SceneKey,
  type TraceColourKey,
} from "@/lib/soma/screens";
import { releaseTones, soundSupported, startSound, stopSound } from "@/lib/soma/audio";
import {
  addTrace,
  clearTraces,
  readTraces,
  removeTrace,
  type Trace,
} from "@/lib/soma/traces";

const title = "SOMA FIELD — a quiet sensory interface";
const description =
  "SOMA FIELD is a calm, tactile prototype that offers one sensory invitation at a time and helps a person approach a real object, sound, room, or companion.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SomaField,
});

function SomaField() {
  const [id, setId] = useState(START);
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [soundPending, setSoundPending] = useState(false);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [kept, setKept] = useState<Trace[]>([]);
  const [nearby, setNearby] = useState<string>("");
  /** Which sensory world the visitor is in, so a kept trace can replay it. */
  const [scene, setScene] = useState<SceneKey>("cloth");
  const [pendingColour, setPendingColour] = useState<TraceColourKey | null>(null);
  /** Which kept trace is being met again, and whether a quiet action is asking. */
  const [openTrace, setOpenTrace] = useState<number | null>(null);
  const [asking, setAsking] = useState(false);
  const selectTimer = useRef<number | null>(null);

  const screen = screens[id]!;
  const stageCount = screen.stages?.length ?? 1;
  const activeStage = screen.stages ? stage % stageCount : 0;
  const overlay = screen.stages?.[activeStage] ?? {};

  const eyebrow = overlay.eyebrow ?? screen.eyebrow;
  const heading = overlay.title ?? screen.title;
  const bodyText = overlay.body ?? screen.body;
  const footnote = overlay.footnote ?? screen.footnote;

  const recalled = openTrace === null ? null : (kept[openTrace] ?? null);
  const shownTrace = screen.replay ? recalled : trace;

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

  /** Sound never survives leaving a screen, stopping, or hiding the page. */
  useEffect(() => {
    setKept(readTraces());
  }, []);

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
      const arriving = screens[next]?.nearby;
      if (arriving) setNearby(arriving);
      const world = screens[next]?.scene;
      if (world) setScene(world);
      setHistory((previous) => [...previous.slice(-24), id]);
      setId(next);
    },
    [id, silence],
  );

  const choose = (option: { title: string; to: string }) => {
    setSelected(option.title);
    if (selectTimer.current) window.clearTimeout(selectTimer.current);
    // Let the chosen object respond before the page changes.
    selectTimer.current = window.setTimeout(() => go(option.to), 520);
  };

  /** Two one-tap steps: a colour, then a word. Only the latest trace is kept. */
  const pickColour = (option: { label: string; colour: TraceColourKey }) => {
    setSelected(option.label);
    setPendingColour(option.colour);
    if (selectTimer.current) window.clearTimeout(selectTimer.current);
    selectTimer.current = window.setTimeout(() => go("traceWord"), 520);
  };

  const pickWord = (option: { label: string }) => {
    setSelected(option.label);
    const colour = pendingColour ?? trace?.colour ?? "blue";
    const next: Trace = {
      colour,
      word: option.label,
      nearby: nearby || "A quiet moment",
      scene,
    };
    setTrace(next);
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
    if (soundOn) {
      silence();
      return;
    }
    setSoundPending(true);
    const started = await startSound(screen.soundKind ?? "rain");
    setSoundPending(false);
    setSoundOn(started);
  };

  /** "Remove it" / "Leave nothing" / "Take them all away" / "Remove this one". */
  const runQuiet = () => {
    const quiet = screen.quiet;
    if (!quiet) return;
    if (screen.replay) {
      if (openTrace !== null) setKept(removeTrace(openTrace));
      setOpenTrace(null);
    } else if (screen.collection) {
      clearTraces();
      setKept([]);
      setTrace(null);
      setPendingColour(null);
    } else if (screen.showTrace) {
      // The trace just kept: remove only that one.
      if (kept.length > 0) setKept(removeTrace(0));
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
          setId(history[history.length - 1]!);
          setHistory((previous) => previous.slice(0, -1));
        }
      : undefined;

  return (
    <>
      <Screen
        surface={screen.surface}
        eyebrow={eyebrow}
        footnote={footnote}
        onBack={back}
        onHelp={() => setHelpOpen(true)}
      >
        <div key={id} className="screen-enter flex flex-1 flex-col">
          {screen.pick ? (
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
                <WordChoices options={screen.pick.options} selected={selected} onPick={pickWord} />
              )}
            </>
          ) : screen.gesture ? (
            <>
              <div className="mt-7 grid place-items-center rounded-card bg-field px-4 py-5 transition-colors duration-700 sm:px-5 sm:py-6">
                {screen.gesture.mode === "sill" ? (
                  <WindowField className="h-52 w-full max-w-[300px] sm:h-56" />
                ) : screen.gesture.mode === "loop" || screen.gesture.mode === "weave" ? (
                  <ThreadField
                    mode={screen.gesture.mode}
                    className="h-52 w-full max-w-[300px] sm:h-56"
                  />
                ) : (
                  <ClothField
                    mode={screen.gesture.mode}
                    className="h-52 w-full max-w-[300px] sm:h-56"
                  />
                )}
              </div>
              <div key={`${id}-${activeStage}`} className="stage-enter mt-8 text-center sm:mt-9">
                <Title>{heading}</Title>
                {bodyText
                  ? bodyText.split("\n").map((line) => <Body key={line}>{line}</Body>)
                  : null}
              </div>
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
                onOpen={(index) => {
                  setOpenTrace(index);
                  go("recall");
                }}
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
                <Title>{heading}</Title>
                {bodyText
                  ? bodyText.split("\n").map((line) => <Body key={line}>{line}</Body>)
                  : null}
                {screen.showTrace && shownTrace ? (
                  <TraceMark
                    colour={shownTrace.colour}
                    word={shownTrace.word}
                    nearby={shownTrace.nearby}
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
            {screen.primary ? (
              <PrimaryAction label={screen.primary.label} onClick={() => go(screen.primary!.to)} />
            ) : null}
            {screen.secondary ? (
              <SecondaryAction
                label={screen.secondary.label}
                onClick={() => go(screen.secondary!.to)}
              />
            ) : null}
            {id === START && kept.length > 0 ? (
              <SecondaryAction
                label={`Meet again — ${kept.length} kept`}
                onClick={() => go("traces")}
              />
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
                <Link
                  to="/field-note"
                  className="text-base text-muted-foreground underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-foreground"
                >
                  Field note
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </Screen>

      {helpOpen ? (
        <HelpOverlay
          surface={screen.surface}
          eyebrow={eyebrow}
          text={screen.help}
          onClose={() => setHelpOpen(false)}
        />
      ) : null}
    </>
  );
}
