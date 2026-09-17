/*
 * ONE CONTINUOUS SCENE.
 *
 * Window, Cloth and Thread each live in a single persistent picture. The
 * artwork never leaves the screen: it arrives, answers the hand, finds a
 * rhythm, then rests. Only its internal phase, its warmth and its short copy
 * change. There is one action instruction, one visible thing to touch, and one
 * large low-effort button that moves the same transformation without any
 * precise gesture.
 */

import { useCallback, useEffect, useId, useState } from "react";
import { Body, Title } from "@/components/soma/Shell";
import { ClothField } from "@/components/soma/Rhythm";
import { ThreadField } from "@/components/soma/Thread";
import { WindowField } from "@/components/soma/Window";
import { KEEP_BODY, KEEP_QUESTION, sceneStages, type SceneKey } from "@/lib/soma/screens";

/** Three internal moments, then a settled ending. */
export const SCENE_PHASES = 3;

/** What the artwork is clearly offering, for anyone using a screen reader. */
const SCENE_LABELS: Record<SceneKey, string> = {
  window:
    "Interactive window light. Touch or move near the light, or use the Let the light move button.",
  cloth:
    "Interactive faded yellow cloth. Drag across the cloth, or use the Follow the fold button.",
  thread: "Interactive loose thread. Drag the thread, or use the Let the thread turn button.",
};

/** The thread title follows the visible line, never a fixed page of copy. */
const THREAD_STATUS = [
  "A thread is lying loose",
  "A loop is taking shape",
  "Two lines cross and stay",
  "The thread is resting",
];

export function scenePhaseCopy(scene: SceneKey, phase: number) {
  const def = sceneStages[scene];
  if (phase >= SCENE_PHASES) {
    return {
      eyebrow: def.rest.eyebrow,
      atmosphere: def.rest.atmosphere,
      title: KEEP_QUESTION,
      body: KEEP_BODY,
      nearby: def.rest.nearby,
      echo: def.rest.echo,
      resting: true as const,
    };
  }
  const moment = def.phases[Math.max(0, Math.min(SCENE_PHASES - 1, phase))]!;
  return { ...moment, echo: undefined, resting: false as const };
}

export function SceneStage({
  scene,
  phase,
  onTouch,
}: {
  scene: SceneKey;
  phase: number;
  onTouch: (touches: number) => void;
}) {
  const def = sceneStages[scene];
  const copy = scenePhaseCopy(scene, phase);
  const instructionId = `${useId().replace(/:/g, "")}-instruction`;
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    setTurns(0);
  }, [scene]);

  const handleTouch = useCallback(
    (count: number) => {
      setTurns((value) => Math.max(value, count));
      onTouch(count);
    },
    [onTouch],
  );

  /** Thread progress: whichever is further along, the hand or the fallback. */
  const threadLevel =
    phase >= SCENE_PHASES ? 3 : Math.max(Math.min(turns, 2), Math.min(phase, 2));
  const threadStatus = THREAD_STATUS[threadLevel]!;
  const heading = scene === "thread" && !copy.resting ? threadStatus : copy.title;

  return (
    <>
      <div
        role="group"
        aria-label={SCENE_LABELS[scene]}
        aria-describedby={copy.resting ? undefined : instructionId}
        className="mt-7 grid place-items-center rounded-card bg-field px-4 py-5 transition-colors duration-700 sm:px-5 sm:py-6"
      >
        {scene === "window" ? (
          <WindowField
            phase={phase}
            onTouch={handleTouch}
            className="h-52 w-full max-w-[300px] sm:h-56"
          />
        ) : scene === "cloth" ? (
          <ClothField
            phase={phase}
            onTouch={handleTouch}
            className="h-52 w-full max-w-[300px] sm:h-56"
          />
        ) : (
          <ThreadField
            mode={phase >= 2 ? "weave" : "loop"}
            onTouch={handleTouch}
            className="h-52 w-full max-w-[300px] sm:h-56"
          />
        )}
      </div>

      {!copy.resting ? (
        <p id={instructionId} className="mt-4 text-center text-[1.0625rem] leading-snug text-foreground">
          {def.instruction}
        </p>
      ) : null}

      {scene === "thread" ? (
        <p aria-live="polite" className="sr-only">
          {threadStatus}
        </p>
      ) : null}

      <div key={`${scene}-${phase}`} className="stage-enter mt-7 text-center sm:mt-8">
        <p className="mb-3 text-[0.9375rem] leading-snug text-faint">{copy.atmosphere}</p>
        <Title>{heading}</Title>
        {copy.body.split("\n").map((line) => (
          <Body key={line}>{line}</Body>
        ))}
        {copy.echo ? (
          <p className="mt-5 font-display text-[1.2rem] leading-snug text-clay">{copy.echo}</p>
        ) : null}
      </div>
    </>
  );
}
