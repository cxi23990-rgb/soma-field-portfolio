# SOMA FIELD

A humane sensory-interface prototype for older adults experiencing cognitive decline.

SOMA FIELD does not ask a person to learn a conventional app, remember instructions or complete a test. It offers one calm sensory invitation at a time and supports an approach toward a real object, sound, material, room or social encounter.

## Live project

[soma.work-jiangnan.com](https://soma.work-jiangnan.com)

## Repository status

This public repository begins from the approved 4 August 2026 baseline. The baseline is a stable reference point rather than a declaration that the project can no longer evolve.

The corresponding source tag is `baseline-2026-08-04`.

## Design principles

- one invitation and one primary action at a time
- large touch targets and highly legible type
- no scoring, diagnosis, memory testing or infantilising language
- sound is optional and never autoplays
- pause, stop and leave remain available
- motion communicates presence rather than entertainment
- the digital interface acts as a threshold into physical experience

## Experience routes

- Listen · Window — rain on old glass, window light, leaf shadows and a warming patch of light on the sill
- Look · Cloth — a square of faded yellow cotton that answers the hand and curves into the shape of holding
- Touch · Thread — a loose thread that forms a loop, a petal or a woven rhythm

Each route ends with an optional colour-and-word trace, which can be met again or removed.

## Design process

The project moves from care-setting observations to a low-demand sensory interaction model, then tests that model through three distinct prototype scenes. The process and evidence boundary are documented in [docs/PROCESS.md](docs/PROCESS.md).

## Development

```sh
bun install
bun run dev
```

Create a production build with:

```sh
bun run build
```

## Technology

React 19, TypeScript, TanStack Start, Vite, Tailwind CSS and Nitro.

Source is published for portfolio review. Research observations, design hypotheses and implemented behaviours are identified separately in the process documentation.
