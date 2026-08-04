import type { ReactNode } from "react";
import {
  BreathField,
  ClothForm,
  CompanionForm,
  FrameForm,
  MachineForm,
  PiecesForm,
  RingField,
  RobotForm,
  RoomForm,
  SpiralField,
  TableForm,
  ThresholdForm,
  TraceForm,
  YarnForm,
} from "@/components/soma/Art";
import { EmbraceForm, FoldedTextile, RhythmCue } from "@/components/soma/Rhythm";
import {
  AfternoonWarmth,
  GlassLight,
  LeafShadow,
  RainGlass,
  SillPatch,
  WindowRecall,
} from "@/components/soma/Window";
import { ThreadCue, ThreadRest } from "@/components/soma/Thread";
import type { SoundKind } from "@/lib/soma/audio";

export type ArtKey =
  | "spiral"
  | "rings"
  | "cloth"
  | "frame"
  | "trace"
  | "companion"
  | "robot"
  | "room"
  | "pieces"
  | "yarn"
  | "table"
  | "threshold"
  | "breath"
  | "machine"
  | "rhythmCue"
  | "textile"
  | "embrace"
  | "rainGlass"
  | "glassLight"
  | "leafShadow"
  | "sillPatch"
  | "afternoon"
  | "windowRecall"
  | "threadCue"
  | "threadRest";

export const artwork: Record<
  ArtKey,
  (props: { className?: string; stage?: number }) => ReactNode
> = {
  spiral: SpiralField,
  rings: RingField,
  cloth: ClothForm,
  frame: FrameForm,
  trace: TraceForm,
  companion: CompanionForm,
  robot: RobotForm,
  room: RoomForm,
  pieces: PiecesForm,
  yarn: YarnForm,
  table: TableForm,
  threshold: ThresholdForm,
  breath: BreathField,
  machine: MachineForm,
  rhythmCue: RhythmCue,
  textile: FoldedTextile,
  embrace: EmbraceForm,
  rainGlass: RainGlass,
  glassLight: GlassLight,
  leafShadow: LeafShadow,
  sillPatch: SillPatch,
  afternoon: AfternoonWarmth,
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
  /** A hand on the material: each touch answers and sounds one soft tone. */
  gesture?: { mode: "smooth" | "pat" | "loop" | "weave" | "sill" };
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

  choices?: {
    kind: "cards" | "stacked" | "portals";
    options: { title: string; subtitle: string; art?: ArtKey; to: string }[];
  };
};

export const START = "encounter";

export const screens: Record<string, ScreenDef> = {
  encounter: {
    surface: "slate",
    eyebrow: "A quiet encounter",
    help: "Something is waiting nearby. Nothing needs to be remembered, and you may stop at any time. Press the large button when you would like to come closer.",
    footnote: "One object, waiting to respond.",
    art: "spiral",
    title: "It is here",
    body: "A small object, an arm's length away.\nThe line turns slowly, like water.",
    primary: { label: "Move closer", to: "choice" },
    quiet: { label: "Not now", to: "rest" },
  },

  choice: {
    surface: "slate",
    eyebrow: "Three things are nearby",
    help: "Three things are near you. Choose whichever one draws you. Each one is complete on its own, and another one will still be here another day.",
    footnote: "One you hear, one you see, one you hold.",
    title: "Which one draws you closer?",
    body: "Rain, cloth, or a loose thread.",
    choices: {
      kind: "portals",
      options: [
        {
          title: "Listen · Window",
          subtitle: "Rain near an old window",
          art: "rainGlass",
          to: "windowRain",
        },
        {
          title: "Look · Cloth",
          subtitle: "A folded square of faded yellow cotton",
          art: "cloth",
          to: "approachCloth",
        },
        {
          title: "Touch · Thread",
          subtitle: "A loose loop of thread",
          art: "threadCue",
          to: "threadCue",
        },
      ],
    },
    quiet: { label: "Stop", to: "rest" },
  },

  /* ------------------------------------------------------------------ *
   * SCENE 01 — WINDOW & SEASON.
   * Rain on old glass, the light through it, leaves moving outside, a
   * patch of light crossing the sill, and the warmth of the afternoon.
   * ------------------------------------------------------------------ */
  windowRain: {
    surface: "slate",
    scene: "window",
    eyebrow: "Rain on old glass",
    help: "Rain is falling on one window. Nothing plays until you turn sound on, and it fades out again the moment you leave.",
    footnote: "Water gathers, then slides.",
    art: "rainGlass",
    artFramed: true,
    nearby: "Rain on old glass",
    title: "Rain is running down the glass",
    body: "Water gathers at the top of the pane.\nWhen it is heavy enough, it slides.",
    sound: "off",
    soundKind: "rain",
    primary: { label: "Stay with it", to: "windowGlass" },
    secondary: { label: "Stop", to: "rest" },
    stages: [
      {},
      {
        title: "The rain has found a slower pace",
        body: "Three taps, then a pause.\nThe glass is cool from the inside.",
      },
      {
        eyebrow: "Still listening",
        title: "The garden bends behind the water",
        body: "Shapes soften where the glass is old.\nThe frame is wood, painted many times.",
      },
    ],
  },

  windowGlass: {
    surface: "slate",
    scene: "window",
    eyebrow: "Light through the rain",
    help: "The light from outside is coming through the wet glass and lying across the panes. There is nothing to work out here.",
    footnote: "Light laid across two panes.",
    art: "glassLight",
    artFramed: true,
    nearby: "Light through wet glass",
    title: "The light comes through the rain",
    body: "It leans across both panes.\nOne edge is brighter than the other.",
    primary: { label: "Look outside", to: "windowLeaf" },
    secondary: { label: "Stop", to: "rest" },
    stages: [
      {},
      {
        title: "The light has widened",
        body: "It reaches the inner frame now.\nThe rain has thinned a little.",
      },
    ],
  },

  windowLeaf: {
    surface: "slate",
    scene: "window",
    eyebrow: "Leaves against the glass",
    help: "Leaves outside are moving in the wind, and their shadows cross the glass. Only looking is needed.",
    footnote: "Wind, then stillness, then wind.",
    art: "leafShadow",
    artFramed: true,
    nearby: "Leaf shadows on the glass",
    title: "Leaf shadows cross the pane",
    body: "They lean one way, then come back.\nThe wind arrives in short passes.",
    sound: "off",
    soundKind: "room",
    primary: { label: "Look at the sill", to: "windowSill" },
    secondary: { label: "Stop", to: "rest" },
    stages: [
      {},
      {
        title: "A larger leaf has come near",
        body: "Its shadow softens the light beneath.\nThe smaller ones follow behind it.",
      },
      {
        eyebrow: "The wind has dropped",
        title: "They have gone almost still",
        body: "One leaf turns slowly on its stem.\nThe glass holds their outlines.",
      },
    ],
  },

  windowSill: {
    surface: "slate",
    scene: "window",
    eyebrow: "A patch of light on the sill",
    help: "A patch of light rests on the wooden sill and moves a little each time you stay. Nothing is timed and nothing is measured.",
    footnote: "It moves a hand's width, slowly.",
    art: "sillPatch",
    artFramed: true,
    gesture: { mode: "sill" },
    nearby: "A patch of light on the sill",
    title: "Light is resting on the wood",
    body: "A pale shape, warm at its centre.\nLay a hand where it rests, or simply stay.",
    primary: { label: "Stay a moment", to: "windowSill" },
    secondary: { label: "Feel the afternoon", to: "windowAfternoon" },
    stages: [
      {},
      {
        title: "The patch has moved along the sill",
        body: "A hand's width further, no more.\nThe wood is warm where it has been.",
      },
      {
        eyebrow: "Still moving",
        title: "It has reached the paint",
        body: "The edge softens against the frame.\nThe grain of the wood shows through.",
      },
      {
        eyebrow: "Quiet",
        title: "It rests near the corner",
        body: "Almost still now.\nOne long breath, and stay.",
      },
    ],
  },

  windowAfternoon: {
    surface: "slate",
    scene: "window",
    eyebrow: "The afternoon is turning",
    help: "The colour of the light is changing as the afternoon goes on. This is the last part of the window. You may keep one colour and one word, or leave nothing.",
    footnote: "Cooler, then warmer, then low.",
    art: "afternoon",
    artFramed: true,
    nearby: "The warmth of the afternoon",
    title: "The afternoon has grown warmer",
    body: "The room has taken the colour of the light.\nThe rain is only a sound now.",
    sound: "off",
    soundKind: "room",
    primary: { label: "Stay with it", to: "windowAfternoon" },
    secondary: { label: "Continue", to: "windowClose" },
    stages: [
      {},
      {
        title: "The warmth has deepened",
        body: "Clay along the frame, cooler in the corners.\nYour shoulders can come down.",
      },
      {
        eyebrow: "Low light",
        title: "The light sits low in the room",
        body: "It has left the sill and found the floor.\nNothing here needs naming.",
      },
    ],
  },

  windowClose: {
    surface: "slate",
    scene: "window",
    eyebrow: "Complete",
    help: "This is the end of the window. You may keep one colour and one word from it, or leave nothing at all.",
    footnote: "A colour, then a word — or nothing.",
    art: "windowRecall",
    artFramed: true,
    nearby: "Rain, leaves and low light",
    title: "The window has said everything",
    body: "Wind, leaf, light, or rain — one of them stayed with you.",
    primary: { label: "Keep a colour and a word", to: "traceColour" },
    secondary: { label: "Something else nearby", to: "choice" },
    quiet: { label: "Leave nothing", to: "meet" },
  },

  /* ------------------------------------------------------------------ *
   * SCENE 03 — THREAD & MAKING.
   * A loose thread on a quiet surface, answering the hand with a loop,
   * another loop, a petal, a woven rhythm. No finished result.
   * ------------------------------------------------------------------ */
  threadCue: {
    surface: "slate",
    scene: "thread",
    eyebrow: "A loose thread",
    help: "A thread is resting on a surface near you. It only answers when you come closer. There is nothing to make and nothing to finish.",
    footnote: "Wool, loosely laid down.",
    art: "threadCue",
    artFramed: true,
    nearby: "A loose loop of thread",
    title: "A thread is lying loose",
    body: "One long line across the wood.\nIt lifts a little where it crosses itself.",
    primary: { label: "Come closer", to: "threadNear" },
    quiet: { label: "Not now", to: "rest" },
    stages: [
      {},
      {
        title: "It has taken one turn",
        body: "The line curls back on itself.\nThe fibre catches the light along one side.",
      },
      {
        eyebrow: "Nearer",
        title: "The end has come to rest",
        body: "A small knot holds at the far end.\nNothing is pulling on it.",
      },
    ],
  },

  threadNear: {
    surface: "slate",
    scene: "thread",
    eyebrow: "Close enough to touch",
    help: "You are beside the thread now. Rest a hand on it, or simply look. Sound only begins if you ask for it.",
    footnote: "Cool at first, then warm.",
    art: "threadCue",
    artFramed: true,
    nearby: "Thread under an open hand",
    title: "It is within reach",
    body: "Cool wool, with a little weight.\nOne strand lies across your fingers.",
    sound: "off",
    soundKind: "cloth",
    primary: { label: "Let it take a turn", to: "threadLoop" },
    secondary: { label: "Stop", to: "rest" },
  },

  threadLoop: {
    surface: "slate",
    scene: "thread",
    eyebrow: "The thread answers",
    help: "Touch anywhere on the surface. The thread takes another turn where your hand passes. There is no correct shape and nothing is counted — you may leave it unfinished.",
    footnote: "A loop, then another, then a petal.",
    nearby: "One loop of warm wool",
    title: "Let it loop where you touch",
    body: "The line turns and holds.\nAnother turn joins the first.",
    gesture: { mode: "loop" },
    primary: { label: "A slower rhythm", to: "threadWeave" },
    secondary: { label: "Stop", to: "rest" },
  },

  threadWeave: {
    surface: "slate",
    scene: "thread",
    eyebrow: "A woven rhythm",
    help: "Move your hand slowly across the surface. The line takes narrower turns, over and under, at whatever pace suits you.",
    footnote: "Over, under, over.",
    nearby: "A simple woven rhythm",
    title: "Over, and under, and over",
    body: "The turns lie flatter now.\nThe surface warms where you pass.",
    gesture: { mode: "weave" },
    sound: "off",
    soundKind: "cloth",
    primary: { label: "Let it rest", to: "threadForm" },
    secondary: { label: "Stop", to: "rest" },
  },

  threadForm: {
    surface: "slate",
    scene: "thread",
    eyebrow: "The form is resting",
    help: "Whatever the thread became is complete as it is. It is not a result and it is not kept anywhere.",
    footnote: "Unfinished is also finished.",
    art: "threadRest",
    artFramed: true,
    nearby: "A resting loop of thread",
    title: "It holds the shape you gave it",
    body: "The turns breathe a little, then settle.\nNothing more is needed.",
    primary: { label: "Stay a moment", to: "threadForm" },
    secondary: { label: "Continue", to: "threadClose" },
    stages: [
      {},
      {
        title: "The turns have opened out",
        body: "Wider now, like a petal.\nThe fibre has taken your warmth.",
      },
      {
        eyebrow: "Quiet",
        title: "It has stopped moving",
        body: "The line rests on the wood.\nOne long breath out, and stay.",
      },
    ],
  },

  threadClose: {
    surface: "slate",
    scene: "thread",
    eyebrow: "Complete",
    help: "This is the end of the thread. You may keep one colour and one word from it, or leave nothing at all.",
    footnote: "A colour, then a word — or nothing.",
    art: "threadRest",
    artFramed: true,
    nearby: "A resting loop of thread",
    title: "Your hands found their own turn",
    body: "Nothing was asked, and nothing was finished.",
    primary: { label: "Keep a colour and a word", to: "traceColour" },
    secondary: { label: "Something else nearby", to: "choice" },
    quiet: { label: "Leave nothing", to: "meet" },
  },

  // LOOK — the cloth first, then the hands it remembers.
  approachCloth: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "The cloth is closer",
    help: "The cloth is nearer now. Look for as long as you like, then continue or stop.",
    footnote: "Old cotton, washed many times.",
    art: "cloth",
    artFramed: true,
    nearby: "A square of faded yellow cotton",
    title: "The yellow is warmer up close",
    body: "One fold across the middle.\nThe weave is soft where the light lands.",
    primary: { label: "Stay with it", to: "clothHands" },
    secondary: { label: "Stop", to: "rest" },
  },

  clothHands: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "The cloth and the hands",
    help: "Cloth like this has been folded and smoothed many times. Whatever your hands recognise is yours, and needs no explaining.",
    footnote: "Folded, smoothed, folded again.",
    art: "textile",
    artFramed: true,
    nearby: "Cloth folded by hand",
    title: "It has been folded before",
    body: "The crease keeps its line.\nOne corner lifts where a thumb once pressed.",
    sound: "off",
    soundKind: "room",
    primary: { label: "Follow the light", to: "environment" },
    secondary: { label: "Stop", to: "rest" },
  },

  environment: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "Fabric landscape",
    help: "Light and line move slowly while you stay. Sound only begins if you ask for it, and you may stop at any moment.",
    footnote: "Light crosses the weave, slowly.",
    art: "cloth",
    artFramed: true,
    nearby: "Light across the weave",
    title: "Light unfolds across the cloth",
    body: "The threads brighten, then dim.\nBreathe once with the light if you like.",
    sound: "off",
    soundKind: "cloth",
    primary: { label: "A slow rhythm", to: "rhythmSmooth" },
    secondary: { label: "Stop", to: "rest" },
    quiet: { label: "Keep a trace instead", to: "trace" },
  },


  trace: {
    surface: "slate",
    eyebrow: "This moment is complete",
    help: "You may keep one small trace of this moment: a colour and a word. Only the latest trace is kept, and nothing else is recorded. Leaving nothing is equally fine.",
    footnote: "A colour, then a word.",
    art: "trace",
    title: "Keep a trace of this feeling?",
    body: "Two taps: one colour, one word.",
    primary: { label: "Choose a colour", to: "traceColour" },
    quiet: { label: "Leave nothing", to: "meet" },
  },

  traceColour: {
    surface: "slate",
    eyebrow: "Choose a colour",
    help: "Touch whichever colour looks closest to this moment. There is no right colour, and you may change it next time.",
    footnote: "Touch one colour.",
    title: "Which colour is this moment?",
    pick: {
      kind: "colour",
      options: [
        { label: "Deep blue", colour: "blue" },
        { label: "Warm clay", colour: "clay" },
        { label: "Pale mist", colour: "mist" },
      ],
      to: "traceWord",
    },
    quiet: { label: "Leave nothing", to: "meet" },
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
    quiet: { label: "Leave nothing", to: "meet" },
  },

  kept: {
    surface: "slate",
    eyebrow: "Kept",
    help: "Your trace is held on this device only: a colour, a word, and what was nearby. It can be removed whenever you like.",
    art: "trace",
    title: "A little colour is held for you",
    body: "It will be here when you come back.",
    showTrace: true,
    primary: { label: "Meet again", to: "traces" },
    quiet: { label: "Remove it", to: "traces" },
    confirmQuiet: {
      question: "Remove this trace?",
      keep: "Keep it",
      go: "Yes, remove",
    },
  },

  traces: {
    surface: "ivory",
    eyebrow: "Meet again",
    help: "A few traces kept before, on this device only. They are not results and not a test — only colours, words, and what was nearby. You may take them all away in one tap.",
    footnote: "A colour, a word, and what was near.",
    collection: true,
    title: "What you kept before",
    body: "Small atmospheres, nothing more.",
    primary: { label: "Begin today", to: "meet" },
    quiet: { label: "Take them all away", to: "traces" },
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


  // A FAMILIAR RHYTHM — cloth, hands, and a rocking tempo.
  rhythmCue: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "Something pale yellow",
    help: "A shape is arriving slowly. There is nothing to identify and nothing to answer. Come closer when you want to, or leave.",
    footnote: "Pale yellow, low to the ground.",
    art: "rhythmCue",
    title: "A pale yellow curve is appearing",
    body: "It comes in slowly, close to the floor.\nA second line follows a little behind.",
    primary: { label: "Come closer", to: "rhythmCloth" },
    quiet: { label: "Not now", to: "rest" },
  },

  rhythmCloth: {
    surface: "slate",
    scene: "cloth",
    nearby: "A folded cloth by the window",
    eyebrow: "A folded cloth",
    help: "A folded cloth is near you now. Look, listen, or rest a hand on it — any of these is enough. You may leave at any time.",
    footnote: "Faded yellow cotton, folded once.",
    art: "textile",
    artFramed: true,
    title: "A folded cloth comes closer",
    body: "Faded yellow, soft at the corners.\nWarm where the window light sits.",
    primary: { label: "Stay with it", to: "rhythmChoice" },
    secondary: { label: "Stop", to: "rest" },
  },

  rhythmChoice: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "However you like",
    help: "Three ways to be with the cloth, all equal. Leaving is also a complete choice.",
    footnote: "Any of these is enough.",
    title: "How would you like to stay with it?",
    body: "Look, listen, or let a hand rest.",
    choices: {
      kind: "stacked",
      options: [
        { title: "Look", subtitle: "The folds, and the light along them", to: "rhythmLook" },
        { title: "Listen", subtitle: "Cotton moving, a room away", to: "rhythmListen" },
        { title: "Touch", subtitle: "A palm on the cloth, no hurry", to: "rhythmSmooth" },
      ],
    },
    quiet: { label: "Leave it for now", to: "rest" },
  },

  rhythmLook: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "Looking",
    help: "Only looking. The cloth moves a little as you stay, and nothing is asked of you.",
    footnote: "Three folds, one shadow.",
    art: "textile",
    artFramed: true,
    title: "The folds hold the light",
    body: "Yellow, then a cooler yellow beneath.\nThe edge lifts, then settles.",
    primary: { label: "Rest a hand on it", to: "rhythmSmooth" },
    secondary: { label: "Stop", to: "rest" },
    stages: [
      {},
      {
        title: "The light moves along one fold",
        body: "A warm shadow follows it.\nThe cloth looks softer where it passes.",
      },
      {
        eyebrow: "Still looking",
        title: "The cloth has come a little nearer",
        body: "You could reach it without standing.\nStay as long as you like.",
      },
    ],
  },

  rhythmListen: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "Listening",
    help: "Nothing plays until you turn sound on, and it fades out when you leave this screen.",
    footnote: "Cotton, moving slowly.",
    art: "textile",
    artFramed: true,
    title: "Cotton, moving slowly",
    body: "A low sound, like cloth on cloth.\nTurn it on when you are ready.",
    sound: "off",
    soundKind: "breath",
    primary: { label: "Rest a hand on it", to: "rhythmSmooth" },
    secondary: { label: "Stop", to: "rest" },
  },

  rhythmSmooth: {
    surface: "slate",
    scene: "cloth",
    nearby: "Cloth under an open hand",
    eyebrow: "Your hand on the cloth",
    help: "Move your hand slowly across the cloth. Each touch makes a soft pulse and one quiet tone. Nothing is counted and nothing is kept.",
    footnote: "Slowly, across and back.",
    title: "Smooth the cloth, slowly",
    body: "Move your hand across it.\nThe surface answers where you pass.",
    gesture: { mode: "smooth" },
    primary: { label: "Stay with the rhythm", to: "rhythmPat" },
    secondary: { label: "Stop", to: "rest" },
  },

  rhythmPat: {
    surface: "slate",
    scene: "cloth",
    nearby: "A slow, even rhythm",
    eyebrow: "A soft, even rhythm",
    help: "Touch the cloth whenever it feels right. There is no tempo to keep and no rhythm to get right.",
    footnote: "Whatever pace suits you.",
    title: "Stay with a soft rhythm",
    body: "One touch, then another.\nThe cloth warms under your palm.",
    gesture: { mode: "pat" },
    sound: "off",
    soundKind: "breath",
    primary: { label: "Let it settle", to: "rhythmEmbrace" },
    secondary: { label: "Stop", to: "rest" },
  },

  rhythmEmbrace: {
    surface: "slate",
    scene: "cloth",
    nearby: "Cloth curved like an arm",
    eyebrow: "The cloth has curved",
    help: "The cloth has taken a curved shape. Whatever it reminds you of is yours alone, and needs no words.",
    footnote: "A curve, holding its own shape.",
    art: "embrace",
    artFramed: true,
    title: "The cloth curves like an arm",
    body: "It holds the shape you gave it.\nOne long breath, and stay.",
    primary: { label: "Stay a moment", to: "rhythmEmbrace" },
    secondary: { label: "Continue", to: "rhythmClose" },
    stages: [
      {},
      {
        title: "The curve has deepened",
        body: "Warm on the inside, cooler at the rim.\nNothing here needs naming.",
      },
      {
        eyebrow: "Quiet",
        title: "It rests against your hands",
        body: "The pale yellow line has stopped moving.\nThe room is very still.",
      },
    ],
  },

  rhythmClose: {
    surface: "slate",
    scene: "cloth",
    eyebrow: "Complete",
    help: "This is the end of the cloth. You may keep one colour and one word, or leave nothing at all.",
    footnote: "A colour, then a word — or nothing.",
    art: "trace",
    title: "Your hands found their own rhythm",
    body: "Nothing was asked, and nothing was tested.",
    primary: { label: "Keep a colour and a word", to: "traceColour" },
    secondary: { label: "Something else nearby", to: "choice" },
    quiet: { label: "Leave nothing", to: "meet" },
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

  meet: {
    surface: "ivory",
    eyebrow: "Nearby again",
    help: "Three things are nearby again: a window, a cloth, and a thread. Choose whichever one draws you, or ask for other ways to begin.",
    footnote: "Three doors, all open.",
    title: "What feels right?",
    body: "Something to hear. Something to hold. Something to turn.",
    choices: {
      kind: "portals",
      options: [
        {
          title: "Listen · Window",
          subtitle: "Rain on old glass, and light moving on the sill",
          art: "rainGlass",
          to: "windowRain",
        },
        {
          title: "Look · Cloth",
          subtitle: "A folded square, warm where the light sits",
          art: "cloth",
          to: "rhythmCue",
        },
        {
          title: "Touch · Thread",
          subtitle: "A loose line that turns where you touch it",
          art: "threadCue",
          to: "threadCue",
        },
      ],
    },
    secondary: { label: "What I kept before", to: "traces" },
    quiet: { label: "Other ways to begin", to: "meetMore" },
  },

  meetMore: {
    surface: "ivory",
    eyebrow: "Nearby again",
    help: "A few quieter ways to begin: a room with low light, familiar pieces on a table, or a small machine that answers in short sentences.",
    footnote: "A room, a table, a machine.",
    title: "Or begin like this",
    body: "A quiet room. Shapes on a table. A voice that answers slowly.",
    choices: {
      kind: "stacked",
      options: [
        {
          title: "A quiet room",
          subtitle: "Low light, a chair, and the window",
          to: "settleEntry",
        },
        {
          title: "Yarn and a frame",
          subtitle: "Wool with a little weight, beside wood",
          to: "makeEntry",
        },
        {
          title: "Look at one piece",
          subtitle: "Wooden shapes, resting a hand apart",
          to: "thinkEntry",
        },
        {
          title: "Say a few words",
          subtitle: "A small machine that answers in short sentences",
          to: "talkEntry",
        },
      ],
    },
    quiet: { label: "Back to the first three", to: "meet" },
  },


  // MAKE
  makeEntry: {
    surface: "ivory",
    eyebrow: "Yarn beside the wooden frame",
    help: "One landmark at a time. Find the frame in the room, and the yarn will be beside it. You may stop at any step.",
    footnote: "One landmark at a time.",
    art: "frame",
    artFramed: true,
    title: "Follow this one landmark",
    body: "A wooden frame, about the width of your shoulders.\nThe yarn rests against its foot.",
    primary: { label: "Next step", to: "makeArrival" },
    quiet: { label: "Stop", to: "rest" },
  },

  makeArrival: {
    surface: "ivory",
    nearby: "Yarn with a little weight",
    eyebrow: "You have arrived",
    help: "You are beside the yarn now. Pick it up if you wish, or simply rest your hand on it.",
    footnote: "Wool, cool at first touch.",
    art: "yarn",
    artFramed: true,
    title: "The yarn is here",
    body: "It has a little weight in the palm.\nLet one strand lie across your fingers.",
    primary: { label: "Hold the yarn", to: "makeCompanion" },
    secondary: { label: "Stop", to: "rest" },
  },

  makeCompanion: {
    surface: "ivory",
    nearby: "One loop of warm wool",
    eyebrow: "One loop at a time",
    help: "Loop the yarn once, then again if you like. The line gains one small stitch each time. Nothing is counted, and you may stop whenever your hands are ready.",
    footnote: "Loose or tight, both hold.",
    art: "yarn",
    title: "Loop it once around your finger",
    body: "The wool warms where you hold it.\nLet the loop rest, then release.",
    primary: { label: "Loop it again", to: "makeCompanion" },
    secondary: { label: "Rest my hands", to: "trace" },
    stages: [
      {},
      {
        title: "A stitch is holding",
        body: "The thread has caught the cloth.\nPress it flat with your thumb.",
      },
      {
        eyebrow: "The wool has taken your warmth",
        title: "The loop is warmer now",
        body: "Wool holds heat longer than cotton.\nTurn it once between two fingers.",
      },
      {
        title: "One thread lies over another",
        body: "Two lines cross and stay.\nRun a fingertip along the ridge.",
      },
      {
        eyebrow: "It holds without your hands",
        title: "The work holds its own weight",
        body: "Place it in your palm and let go.\nIt keeps its shape.",
      },
    ],
  },

  // SETTLE
  settleEntry: {
    surface: "ivory",
    eyebrow: "A quiet room",
    help: "A room with soft light is nearby. Walk toward the window and sit if you wish. Stopping is always allowed.",
    footnote: "Six steps, perhaps seven.",
    art: "threshold",
    artFramed: true,
    title: "Light is resting by the window",
    body: "A pale square lies on the floorboards.\nThe chair is at its edge.",
    primary: { label: "Next step", to: "settleArrival" },
    quiet: { label: "Stop", to: "rest" },
  },

  settleArrival: {
    surface: "ivory",
    nearby: "A quiet room, low light",
    eyebrow: "You are here",
    help: "You are in the quiet room. Stay as long as it feels good. This room has no sound.",
    footnote: "The floor is warm where the light sits.",
    art: "room",
    artFramed: true,
    title: "You can stay a while",
    body: "The light moves a hand's width every hour.\nLet your shoulders down.",
    sound: "unavailable",
    primary: { label: "Stay a while", to: "settleCompanion" },
    secondary: { label: "Leave the room", to: "rest" },
  },

  settleCompanion: {
    surface: "ivory",
    nearby: "A circle, breathing slowly",
    eyebrow: "Breathing space",
    help: "The circle settles a little further each time you stay. Follow it with your breath if you like, or simply watch. Nothing is measured.",
    footnote: "Watching is as good as breathing along.",
    art: "breath",
    title: "In, and out again",
    body: "The circle widens, then narrows.\nLet your breath find its own length.",
    primary: { label: "Stay longer", to: "settleCompanion" },
    secondary: { label: "That is enough", to: "trace" },
    stages: [
      {},
      {
        eyebrow: "The room has gone quieter",
        title: "A little slower now",
        body: "The circle has drawn itself closer.\nYour hands can open on your knees.",
      },
      {
        eyebrow: "Settled",
        title: "It has come to rest",
        body: "The centre is warm and still.\nOne long breath out, and stay.",
      },
    ],
  },

  // THINK
  thinkEntry: {
    surface: "slate",
    eyebrow: "Familiar shapes on a table",
    help: "A few familiar pieces are on the table. Nothing here is measured or scored.",
    footnote: "Wood on wood, no sound.",
    art: "table",
    title: "A few pieces are waiting",
    body: "Three shapes on a bare table.\nA hand's width lies between them.",
    primary: { label: "Come to the table", to: "thinkArrival" },
    quiet: { label: "Stop", to: "rest" },
  },

  thinkArrival: {
    surface: "slate",
    nearby: "Wooden shapes on a table",
    eyebrow: "Look at one piece",
    help: "You may move one piece or simply look. There is no answer to find here, and no score.",
    footnote: "Cool edges, square corners.",
    art: "companion",
    title: "Choose one to look at",
    body: "The blue square sits nearest your hand.\nLift it, or leave it where it is.",
    primary: { label: "See one more move", to: "thinkCompanion" },
    secondary: { label: "End", to: "trace" },
  },

  thinkCompanion: {
    surface: "slate",
    nearby: "Shapes finding a distance",
    eyebrow: "One move was made",
    help: "A piece moves a little each time you stay, so you can notice how the shapes sit together. Nothing here is right or wrong.",
    footnote: "Only the distance changes.",
    art: "table",
    title: "The blue square moved closer",
    body: "Now two fingers of space remain.\nNotice which shape your eye goes to.",
    primary: { label: "See one more move", to: "thinkCompanion" },
    secondary: { label: "End", to: "trace" },
    stages: [
      {},
      {
        title: "Now they sit side by side",
        body: "Two edges almost touching.\nThe shadow between them is thin.",
      },
      {
        title: "One piece lifted a little",
        body: "The circle floats above the pair.\nIts shadow has moved to the left.",
      },
      {
        eyebrow: "The table is wide",
        title: "The shapes found a new distance",
        body: "Far apart, the table looks larger.\nLet your eyes travel between them.",
      },
    ],
  },

  // TALK
  talkEntry: {
    surface: "ivory",
    eyebrow: "A small machine is nearby",
    help: "This is a machine, not a person. It replies with a few prepared words, understands very little, and keeps nothing you say.",
    footnote: "Clearly a robot.",
    art: "robot",
    title: "It is a machine, and it says so",
    body: "A small square face on the shelf.\nIt answers in short sentences.",
    primary: { label: "Say something", to: "talkArrival" },
    quiet: { label: "Stop", to: "rest" },
  },

  talkArrival: {
    surface: "ivory",
    nearby: "A small machine, speaking slowly",
    eyebrow: "The robot is responding",
    help: "The words shown are preset replies. Say more if you like, or end here. Nothing spoken is stored.",
    footnote: "A slow, even voice.",
    art: "machine",
    title: "“I hear you.”",
    body: "The voice is low and even.\nSpeak at whatever pace suits you.",
    primary: { label: "Say one more thing", to: "talkCompanion" },
    secondary: { label: "End", to: "trace" },
  },

  talkCompanion: {
    surface: "ivory",
    nearby: "A slow, even voice",
    eyebrow: "The robot is responding",
    help: "Each reply is one of a few prepared sentences. The machine understands very little, and nothing spoken here is stored.",
    footnote: "Nothing spoken here is kept.",
    art: "machine",
    title: "“Stay as long as you like.”",
    body: "It waits a beat before answering.\nThe line of light rises as it speaks.",
    primary: { label: "Say one more thing", to: "talkCompanion" },
    secondary: { label: "End", to: "trace" },
    stages: [
      {},
      {
        title: "“That sounds important to you.”",
        body: "The voice drops a little at the end.\nYou may answer, or simply listen.",
      },
      {
        eyebrow: "The machine is listening",
        title: "“I am listening, in my simple way.”",
        body: "The light holds steady while you speak.\nIt understands very little.",
      },
      {
        title: "“You may say more, or nothing at all.”",
        body: "The waiting is quiet, without a signal.\nYour breath is the only sound.",
      },
      {
        eyebrow: "It forgets by design",
        title: "“I will forget this, as I always do.”",
        body: "The light falls flat and rests.\nNothing spoken here is stored.",
      },
    ],
  },
};
