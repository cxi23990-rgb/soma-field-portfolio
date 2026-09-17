import type { ReactNode } from "react";
import { ClothForm, SpiralField, TraceForm } from "@/components/soma/Art";
import { EmbraceForm } from "@/components/soma/Rhythm";
import { RainGlass, WindowRecall } from "@/components/soma/Window";
import { ThreadCue, ThreadRest } from "@/components/soma/Thread";
import type { SoundKind } from "@/lib/soma/audio";

export type ArtKey =
  | "spiral"
  | "cloth"
  | "trace"
  | "embrace"
  | "rainGlass"
  | "windowRecall"
  | "threadCue"
  | "threadRest";

export const artwork: Record<
  ArtKey,
  (props: { className?: string; stage?: number }) => ReactNode
> = {
  spiral: SpiralField,
  cloth: ClothForm,
  trace: TraceForm,
  embrace: EmbraceForm,
  rainGlass: RainGlass,
  windowRecall: WindowRecall,
  threadCue: ThreadCue,
  threadRest: ThreadRest,
};

type Action = { label: string; to: string };

/** Copy that changes gently with each repeated tap on the same screen. */
export type Stage = {
  eyebrow?: string;
  title?: string;
  body?: string;
  footnote?: string;
};

/** One-tap trace choices: a colour, then a feeling word. */
export type TraceColourKey = "blue" | "clay" | "mist";

/** The three sensory worlds. A kept trace remembers which one it came from. */
export type SceneKey = "window" | "cloth" | "thread";

export type ScreenDef = {
  surface: "slate" | "ivory";
  eyebrow: string;
  help: string;
  footnote?: string;
  art?: ArtKey;
  artFramed?: boolean;
  title: string;
  body?: string;
  primary?: Action;
  secondary?: Action;
  quiet?: Action;
  sound?: "on" | "off" | "unavailable";
  soundKind?: SoundKind;
  stages?: Stage[];
  pick?:
    | { kind: "colour"; options: { label: string; colour: TraceColourKey }[]; to: string }
    | { kind: "word"; options: { label: string }[]; to: string };
  showTrace?: boolean;
  /** Which sensory world this screen belongs to. */
  scene?: SceneKey;
  /** One continuous, touch-responsive scene with its own internal phases. */
  sceneStage?: SceneKey;
  /** What was nearby on this screen — carried into the kept trace. */
  nearby?: string;
  /** Shows the small shelf of traces kept before. Each card can be opened. */
  collection?: boolean;
  /** A short re-encounter with one kept trace. */
  replay?: boolean;
  /** The quiet action asks once, calmly, before it does anything. */
  confirmQuiet?: { question: string; keep: string; go: string };
  /** A quiet link to the field note, kept away from the main journey. */
  note?: boolean;
  /** A quiet link to the shelf of saved traces. */
  viewTraces?: boolean;
  /** One short field echo, shown only at a settled ending. */
  echo?: string;
  /** A small atmospheric line beside the artwork, above the heading. */
  atmosphere?: string;

  choices?: {
    kind: "cards" | "stacked" | "portals";
    options: { title: string; subtitle: string; art?: ArtKey; to: string }[];
  };
};

export const START = "encounter";

/* ---------------------------------------------------------------- *
 * One continuous scene per world: ARRIVE → RESPOND → REST.
 * The artwork stays on screen the whole time; only its internal
 * phase, its copy and its warmth change.
 * ---------------------------------------------------------------- */

export type ScenePhase = {
  eyebrow: string;
  atmosphere: string;
  title: string;
  body: string;
  nearby: string;
};

export type SceneDef = {
  label: string;
  soundKind: SoundKind;
  /** One short action instruction, shown beside the artwork. */
  instruction: string;
  /** One large low-effort action that advances the same transformation. */
  fallback: string;
  phases: [ScenePhase, ScenePhase, ScenePhase];
  /** The settled ending, where a trace may be kept. */
  rest: {
    eyebrow: string;
    atmosphere: string;
    echo: string;
    nearby: string;
  };
};

export const KEEP_QUESTION = "Would you like to keep a small trace?";
export const KEEP_BODY =
  "A colour and a word can help a companion offer the same invitation another day. Nothing else is recorded.";

export const sceneStages: Record<SceneKey, SceneDef> = {
  window: {
    label: "Listen · Window",
    soundKind: "rain",
    instruction: "Tap or move near the light.",
    fallback: "Let the light move",
    phases: [
      {
        eyebrow: "Rain on old glass",
        atmosphere: "It is raining outside",
        title: "Rain is running down the glass",
        body: "Water gathers at the top of the pane.\nWhen it is heavy enough, it slides.",
        nearby: "Rain on old glass",
      },
      {
        eyebrow: "Light through the rain",
        atmosphere: "The light has come through",
        title: "The light widens where you touch",
        body: "Leaf shadows cross the pane.\nThe warm patch follows your hand.",
        nearby: "Light and leaf shadows on the glass",
      },
      {
        eyebrow: "The afternoon is turning",
        atmosphere: "The room has warmed",
        title: "The warmth has settled on the sill",
        body: "The room has taken the colour of the light.\nThe rain is only a sound now.",
        nearby: "The warmth of the afternoon",
      },
    ],
    rest: {
      eyebrow: "The window is quiet",
      atmosphere: "Rain, leaves and low light",
      echo: "Light returns before the name does.",
      nearby: "Rain, leaves and low light",
    },
  },

  cloth: {
    label: "Look · Cloth",
    soundKind: "cloth",
    instruction: "Move one finger slowly across the cloth.",
    fallback: "Follow the fold",
    phases: [
      {
        eyebrow: "Faded yellow cotton",
        atmosphere: "A folded cloth is near",
        title: "The cloth is folded once",
        body: "Faded yellow, soft at the corners.\nThe crease keeps its line.",
        nearby: "A square of faded yellow cotton",
      },
      {
        eyebrow: "Your hand on the cloth",
        atmosphere: "The weave is warming",
        title: "The fold smooths under your hand",
        body: "The cotton warms where you pass.\nOne fold flattens, then another.",
        nearby: "Cloth under an open hand",
      },
      {
        eyebrow: "The cloth has curved",
        atmosphere: "A slow, even rhythm",
        title: "The cloth curves and holds",
        body: "It keeps the shape you gave it.\nOne long breath, and stay.",
        nearby: "Cloth curved like an arm",
      },
    ],
    rest: {
      eyebrow: "The cloth is resting",
      atmosphere: "Faded yellow, holding its curve",
      echo: "The arms remember a curve.",
      nearby: "Cloth curved like an arm",
    },
  },

  thread: {
    label: "Touch · Thread",
    soundKind: "cloth",
    instruction: "Drag the thread. Stop whenever you like.",
    fallback: "Let the thread turn",
    phases: [
      {
        eyebrow: "A loose thread",
        atmosphere: "Wool, loosely laid down",
        title: "A thread is lying loose",
        body: "One long line across the wood.\nIt lifts where it crosses itself.",
        nearby: "A loose loop of thread",
      },
      {
        eyebrow: "The thread answers",
        atmosphere: "A loop, then another",
        title: "It loops where you pull",
        body: "The line turns back on itself.\nNothing needs to be finished.",
        nearby: "One loop of warm wool",
      },
      {
        eyebrow: "A woven rhythm",
        atmosphere: "Over, under, over",
        title: "Over, and under, and over",
        body: "The turns narrow into a rhythm.\nYour hands may stop whenever they like.",
        nearby: "A simple woven rhythm",
      },
    ],
    rest: {
      eyebrow: "The form is resting",
      atmosphere: "Unfinished is also finished",
      echo: "The hand finds the loop again.",
      nearby: "A resting loop of thread",
    },
  },
};

const cueCards = {
  kind: "portals" as const,
  options: [
    {
      title: "Listen · Window",
      subtitle: "Rain, changing light and leaf shadows.",
      art: "rainGlass" as ArtKey,
      to: "window",
    },
    {
      title: "Look · Cloth",
      subtitle: "Faded yellow cotton to smooth, fold and hold.",
      art: "cloth" as ArtKey,
      to: "cloth",
    },
    {
      title: "Touch · Thread",
      subtitle: "A loose thread to guide into a loop.",
      art: "threadCue" as ArtKey,
      to: "thread",
    },
  ],
};

export const screens: Record<string, ScreenDef> = {
  encounter: {
    surface: "slate",
    eyebrow: "A quiet sensory companion",
    help: "Something is waiting nearby. Nothing needs to be remembered, and you may stop at any time. Press the large button when you would like to begin.",
    footnote: "One object, waiting to respond.",
    art: "spiral",
    atmosphere: "It is here",
    title: "SOMA FIELD",
    body: "A quiet sensory companion.\nChoose one familiar sound, object or movement.\nStay for a moment, then keep a small preference trace.\nNo test. Nothing to remember.",
    primary: { label: "Begin", to: "choice" },
  },

  /** The one cue-selection screen. First visit and returning visit both land here. */
  choice: {
    surface: "slate",
    eyebrow: "Three things are nearby",
    help: "Three things are near you. Choose whichever one draws you. Each one is complete on its own, and another one will still be here another day.",
    footnote: "One you hear, one you see, one you hold.",
    title: "Which one draws you closer?",
    body: "Choose one familiar sound, object or movement.",
    choices: cueCards,
    quiet: { label: "Stop", to: "rest" },
  },

  /* One continuous window, cloth and thread. Each holds three internal
   * moments and a settled ending inside the same visual scene. */
  window: {
    surface: "slate",
    scene: "window",
    sceneStage: "window",
    eyebrow: "Rain on old glass",
    help: "One window, all the way through. Rain, light and leaf shadows answer where you touch. Nothing plays until you turn sound on, and you may stop at any time.",
    title: "Rain is running down the glass",
    sound: "off",
    soundKind: "rain",
  },

  cloth: {
    surface: "slate",
    scene: "cloth",
    sceneStage: "cloth",
    eyebrow: "Faded yellow cotton",
    help: "One piece of faded yellow cotton, all the way through. It warms and smooths where your hand passes. Nothing is counted and you may stop at any time.",
    title: "The cloth is folded once",
    sound: "off",
    soundKind: "cloth",
  },

  thread: {
    surface: "slate",
    scene: "thread",
    sceneStage: "thread",
    eyebrow: "A loose thread",
    help: "One loose thread, all the way through. It takes a turn wherever your hand passes. There is nothing to finish and you may stop at any time.",
    title: "A thread is lying loose",
    sound: "off",
    soundKind: "cloth",
  },

  traceColour: {
    surface: "slate",
    eyebrow: "Choose a colour",
    help: "Touch whichever colour looks closest to this moment. There is no right colour, and you may change it next time.",
    footnote: "Touch one colour.",
    title: "What would you like to keep from this moment?",
    pick: {
      kind: "colour",
      options: [
        { label: "Deep blue", colour: "blue" },
        { label: "Warm clay", colour: "clay" },
        { label: "Pale mist", colour: "mist" },
      ],
      to: "traceWord",
    },
    quiet: { label: "Finish without saving", to: "choice" },
  },

  traceWord: {
    surface: "slate",
    eyebrow: "Choose a word",
    help: "Touch one word. Only these three are offered, and no typing is needed.",
    footnote: "Touch one word.",
    title: "And one word for it?",
    pick: {
      kind: "word",
      options: [{ label: "Warm" }, { label: "Quiet" }, { label: "Familiar" }],
      to: "kept",
    },
    quiet: { label: "Finish without saving", to: "choice" },
  },

  kept: {
    surface: "slate",
    eyebrow: "Kept",
    help: "Your trace is held on this device only: a colour, a word, and what was nearby. It can be removed whenever you like.",
    art: "trace",
    title: "A little colour is held for you",
    body: "It will be here when you come back.",
    showTrace: true,
    note: true,
    viewTraces: true,
    primary: { label: "Replay this encounter", to: "recall" },
    secondary: { label: "Choose another cue", to: "choice" },
    quiet: { label: "Remove this trace", to: "traces" },
    confirmQuiet: {
      question: "Remove this trace?",
      keep: "Keep it",
      go: "Yes, remove",
    },
  },

  traces: {
    surface: "ivory",
    eyebrow: "What you kept before",
    help: "A few traces kept before, on this device only. They are not results and not a test — only colours, words, and what was nearby. You may take them all away in one tap.",
    footnote: "A colour, a word, and what was near.",
    collection: true,
    note: true,
    title: "What you kept before",
    body: "Colours, words and nearby things kept from earlier encounters.",
    primary: { label: "Begin today", to: "choice" },
    quiet: { label: "Remove all saved traces", to: "traces" },
    confirmQuiet: {
      question: "Take them away?",
      keep: "Keep them",
      go: "Yes, clear",
    },
  },

  // One kept trace, met again for a moment. No dates, no record.
  recall: {
    surface: "slate",
    eyebrow: "Here again",
    help: "This is one trace you kept before: a colour, a word, and what was nearby. Stay with it as long as you like, then go back to the others.",
    footnote: "A colour, a word, and what was near.",
    replay: true,
    showTrace: true,
    title: "This one is still here",
    body: "The colour first, then the word.\nNothing else was kept.",
    primary: { label: "Stay", to: "recall" },
    secondary: { label: "Back", to: "traces" },
    quiet: { label: "Remove this one", to: "traces" },
    confirmQuiet: {
      question: "Remove this trace?",
      keep: "Keep it",
      go: "Yes, remove",
    },
    stages: [
      {},
      {
        title: "The colour is steady",
        body: "It holds its own light.\nBreathe once, and stay.",
      },
      {
        eyebrow: "Quiet",
        title: "The word sits beside it",
        body: "Whatever it means is yours.\nThere is nothing to answer.",
      },
    ],
  },

  rest: {
    surface: "slate",
    eyebrow: "Resting",
    help: "Everything has stopped and any sound has faded out. Nothing was lost. You may begin again, or simply stay here.",
    footnote: "The room is still.",
    art: "trace",
    title: "Everything has stopped",
    body: "One soft circle, holding its place.\nStay as long as you like.",
    primary: { label: "Begin again", to: START },
    quiet: { label: "Stay here", to: "rest" },
    note: true,
  },
};
