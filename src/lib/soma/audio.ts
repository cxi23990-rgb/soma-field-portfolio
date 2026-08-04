/**
 * SOMA FIELD sound.
 *
 * A tiny Web Audio soundscape — no files, no remote URLs, no autoplay.
 * The context is created only on an explicit tap, faded in slowly, and fully
 * released when the person leaves the screen, stops, or hides the page.
 */

export type SoundKind = "rain" | "cloth" | "room" | "breath";

type Live = {
  ctx: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

let live: Live | null = null;

const FADE_IN = 2.2;
const FADE_OUT = 1.4;

/**
 * Three sensory identities, one per phase of the encounter:
 * rain at the window (Listen), cloth and a quiet room (Look), and a soft
 * breathing cadence for the shared rhythm.
 */
type Voice = {
  level: number;
  bed: number;
  air: { freq: number; q: number; gain: number; rate: number };
  drift: { rate: number; depth: number };
  /** A slow amplitude swell, like breathing. 0 keeps the sound level. */
  swell?: { rate: number; depth: number };
};

const VOICE: Record<SoundKind, Voice> = {
  rain: {
    level: 0.075,
    bed: 900,
    air: { freq: 2600, q: 0.8, gain: 0.5, rate: 1.07 },
    drift: { rate: 0.06, depth: 260 },
  },
  cloth: {
    level: 0.05,
    bed: 520,
    air: { freq: 1400, q: 1.4, gain: 0.25, rate: 0.82 },
    drift: { rate: 0.035, depth: 120 },
  },
  room: {
    level: 0.042,
    bed: 340,
    air: { freq: 780, q: 2.2, gain: 0.16, rate: 0.7 },
    drift: { rate: 0.022, depth: 70 },
  },
  breath: {
    level: 0.046,
    bed: 420,
    air: { freq: 1050, q: 2.6, gain: 0.14, rate: 0.62 },
    drift: { rate: 0.018, depth: 90 },
    swell: { rate: 0.16, depth: 0.55 },
  },
};

export function soundSupported(): boolean {
  if (typeof window === "undefined") return false;
  return typeof (window.AudioContext ?? (window as never as { webkitAudioContext?: unknown }).webkitAudioContext) !== "undefined";
}

function noiseBuffer(ctx: AudioContext, seconds = 4) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    // gentle low-pass on the noise itself: rain, not hiss
    last = 0.86 * last + 0.14 * white;
    data[i] = last * 1.6;
  }
  return buffer;
}

/** Start (or replace) the soundscape. Must be called from a user gesture. */
export async function startSound(kind: SoundKind): Promise<boolean> {
  if (!soundSupported()) return false;
  stopSound();

  const Ctor =
    window.AudioContext ??
    (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();
  try {
    await ctx.resume();
  } catch {
    // some browsers resolve later; continue
  }
  if (ctx.state !== "running") {
    void ctx.close();
    return false;
  }

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.connect(ctx.destination);

  const sources: AudioScheduledSourceNode[] = [];
  const buffer = noiseBuffer(ctx);
  const voice = VOICE[kind];

  // Body of the sound: soft, wide, continuous.
  const bed = ctx.createBufferSource();
  bed.buffer = buffer;
  bed.loop = true;
  const bedFilter = ctx.createBiquadFilter();
  bedFilter.type = "lowpass";
  bedFilter.frequency.value = voice.bed;
  bedFilter.Q.value = 0.5;
  bed.connect(bedFilter).connect(master);
  bed.start();
  sources.push(bed);

  // Upper layer: rain on a windowsill, fabric, or the air of a still room.
  const air = ctx.createBufferSource();
  air.buffer = buffer;
  air.loop = true;
  air.playbackRate.value = voice.air.rate;
  const airFilter = ctx.createBiquadFilter();
  airFilter.type = "bandpass";
  airFilter.frequency.value = voice.air.freq;
  airFilter.Q.value = voice.air.q;
  const airGain = ctx.createGain();
  airGain.gain.value = voice.air.gain;
  air.connect(airFilter).connect(airGain).connect(master);
  air.start();
  sources.push(air);

  // Very slow movement so the sound never sits perfectly still.
  const drift = ctx.createOscillator();
  drift.type = "sine";
  drift.frequency.value = voice.drift.rate;
  const driftDepth = ctx.createGain();
  driftDepth.gain.value = voice.drift.depth;
  drift.connect(driftDepth).connect(bedFilter.frequency);
  drift.start();
  sources.push(drift);

  // The shared rhythm breathes: a long, shallow swell in and out.
  if (voice.swell) {
    const swell = ctx.createOscillator();
    swell.type = "sine";
    swell.frequency.value = voice.swell.rate;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = voice.level * voice.swell.depth;
    swell.connect(swellDepth).connect(master.gain);
    swell.start();
    sources.push(swell);
  }

  master.gain.linearRampToValueAtTime(voice.level, ctx.currentTime + FADE_IN);

  live = { ctx, master, sources };
  return true;
}

/** Fade out and release everything. Safe to call at any time. */
export function stopSound() {
  const current = live;
  live = null;
  if (!current) return;

  const { ctx, master, sources } = current;
  const now = ctx.currentTime;
  try {
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.0001, now + FADE_OUT);
  } catch {
    // ignore
  }

  window.setTimeout(
    () => {
      for (const source of sources) {
        try {
          source.stop();
        } catch {
          // already stopped
        }
      }
      try {
        master.disconnect();
      } catch {
        // ignore
      }
      void ctx.close().catch(() => undefined);
    },
    FADE_OUT * 1000 + 120,
  );
}

/* ------------------------------------------------------------------ *
 * Lullaby tones.
 *
 * One short, soft tone per touch — never automatic, never a melody the
 * person has to follow. The context is created on the first gesture and
 * released with releaseTones() when the screen changes or the page hides.
 * ------------------------------------------------------------------ */

let toneCtx: AudioContext | null = null;

/** A slow lullaby rocking: two notes, held, then a step down. */
const LULLABY = [392, 392, 440, 349, 392, 330, 294, 330];

export function playLullabyTone(step: number): void {
  if (!soundSupported()) return;
  const Ctor =
    window.AudioContext ??
    (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!toneCtx) toneCtx = new Ctor();
  const ctx = toneCtx;
  void ctx.resume().catch(() => undefined);

  const now = ctx.currentTime;
  const freq = LULLABY[step % LULLABY.length]!;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.055, now + 0.28);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

  const soften = ctx.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 1100;

  const voice = ctx.createOscillator();
  voice.type = "sine";
  voice.frequency.setValueAtTime(freq, now);

  const air = ctx.createOscillator();
  air.type = "sine";
  air.frequency.setValueAtTime(freq * 2.01, now);
  const airGain = ctx.createGain();
  airGain.gain.value = 0.18;

  voice.connect(soften);
  air.connect(airGain).connect(soften);
  soften.connect(gain).connect(ctx.destination);

  voice.start(now);
  air.start(now);
  voice.stop(now + 2.2);
  air.stop(now + 2.2);
}

/** Release the tone context. Safe to call at any time. */
export function releaseTones(): void {
  const ctx = toneCtx;
  toneCtx = null;
  if (!ctx) return;
  void ctx.close().catch(() => undefined);
}
