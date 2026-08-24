# Natural Wild

![version](https://img.shields.io/badge/version-0.8.0-8fe388)
![stack](https://img.shields.io/badge/Next.js%2016%20·%20React%2019%20·%20three.js-0b1a12)

An interactive 3D scroll-driven journey through ten wild places — drift
from the firefly-lit forest floor, up through the golden canopy, into an
autumn woodland, skim across a mirror lake, fly through a waterfall, thread
a dark fjord, soar over alpine peaks, cross the silent tundra and endless
grass, and end on golden sand at sunset.

**Four ways to experience it:** scroll the rails · 🚶 walk on foot ·
🗺️ jump from the sky map · play with the tree & seed experiments.

## How it works

See **[docs/architecture.svg](docs/architecture.svg)** for the full diagram
and **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for the written tour:
scroll → progress ref → camera splines → biome scenes → atmosphere lerp →
WebGL.

## Chapters

I Forest Floor · II The Canopy · III Autumn Woodland · IV Mirror Lake ·
V The Falling Veil · VI The Fjord · VII Alpine Peaks · VIII White Silence ·
IX Endless Grass · X The Golden Sand

## Wildlife

- **Butterflies** — flutter over the forest clearing (`Butterfly.tsx`)
- **Deer** — grazes in the autumn woodland (`Deer.tsx`)
- **Rabbit** — hops and sniffs beside the trail (`Rabbit.tsx`)
- **Leaping fish** — arcs out of the mirror lake with splash rings (`Fish.tsx`)
- **Gulls & swallows** — flocks circling lake and savanna (`Birds.tsx`)
- **Whale** — breaches in the dark fjord water with blowhole spout (`Whale.tsx`)
- **Eagles** — soar with you over the alpine peaks (`Birds.tsx` eagle preset)
- **Arctic fox** — trots the tundra snow (`Fox.tsx`)
- **Giraffe** — ambles between the acacias (`Giraffe.tsx`)
- **Camel** — crosses the desert dunes (`Camel.tsx`)

## Stack

- Next.js 16 + React 19 + TypeScript (App Router)
- Three.js via @react-three/fiber + drei (procedural low-poly forest)
- anime.js v4 (text reveals & micro-animations)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

Other scripts:

```bash
npm run build
npm run lint
npm run typecheck
```

## Anatomy of a Tree — the anime.js way

A single-screen **scroll-free exploded view** (`components/anatomy/TreeAnatomy.tsx`).
Drag the slider or press **▶ Play** to disassemble the tree into seven
staggered parts; past 62% the camera orbits the floating diagram. Click any
part label for its full story and stats in the side panel.

## Seed Sanctuary

A one-screen **physics playground** (`components/sanctuary/SeedSanctuary.tsx`).
Drag upward and release to toss glowing wish-seeds — custom gravity,
bouncing, and spin; wherever a seed settles it sprouts into a tiny glowing
tree (grove caps at 26). Includes landing-predictor ring, wish counter and
grove reset.

## World map mode

Press **🗺️ World map** (bottom-right, next to Free walk) to pull the camera
up into the sky and see all ten biomes as glowing beacon pillars. Click any
beacon label to teleport straight to that chapter.

## Free-walk mode

Press **🚶 Free walk** (bottom-right, desktop only) to leave the rails and
explore all ten biomes on foot:

- **WASD / arrows** — move · **Shift** — run
- **Mouse** — look around (click the canvas to capture the pointer)
- **ESC** — exit back to the scroll journey

You spawn exactly where the scroll journey left off. Page scrolling is
locked while walking.

## Customize the hero

The hero is a fully procedural Three.js scene (no Spline needed) — a
golden-hour forest clearing with god rays, mist, fireflies and falling
leaves. Tweak it in `components/scene/HeroScene.tsx`:

- `buildTrees()` — tree count, ring size, view corridor, framing trunks
- `BEAMS` / `MISTS` / `LEAF_COUNT` / `FLY_COUNT` — atmosphere density
- `SunGlow` position + fog range in the `<Canvas>` for mood

`spline-prompt.txt` keeps the original scene brief if you ever want to
recreate it in an external tool.

## Structure

```
app/                 layout, page, global styles
components/
  Hero.tsx           hero section + canvas mount
  JourneyCanvas.tsx  fixed R3F canvas (client-only)
  Experience.tsx     page orchestrator
  NavDots.tsx        chapter progress dots
  overlay/
    ChapterText.tsx  animated chapter cards (anime.js)
  scene/
    HeroScene.tsx    procedural golden-hour clearing (hero)
    ForestScene.tsx  atmosphere/fog/light controller + composition
    CameraRig.tsx    scroll-driven camera path
    Trees.tsx        instanced low-poly forest
    Rocks.tsx / Mushrooms.tsx
    Fireflies.tsx / FallingLeaves.tsx   GPU particle systems
    MistPlanes.tsx / Rays.tsx           volumetric-ish dressing
    Lake.tsx          calm mirror-lake water shader (chapter IV)
    Autumn.tsx        amber trees + leaf rain (chapter III)
    Deer.tsx          grazing low-poly deer (chapter III)
    Fish.tsx          leaping fish with splash rings (chapter IV)
    Birds.tsx         flapping flock, reusable (lake / savanna)
    Waterfall.tsx     falling veil, spray + foam pool (chapter V)
    Fjord.tsx         basalt walls + dark water passage (chapter VI)
    Alpine.tsx        snow-capped spires + cloud deck (chapter VII)
    Tundra.tsx        snow field, shrubs, snowfall (chapter VIII)
    Savanna.tsx       acacias, termite mounds (chapter IX)
    Desert.tsx        dunes, cacti, rocks (chapter X)
    SunFinale.tsx     desert sunset disc + glow
hooks/useJourney.ts  scroll progress hook
hooks/useSectionProgress.ts  generic section progress
lib/                 chapters, camera paths, atmosphere stops, utils
docs/                architecture diagram + policies + type guide
CHANGELOG.md         release history (Keep a Changelog)
```

## Contributing

Read [`docs/BRANCH_POLICY.md`](docs/BRANCH_POLICY.md) for branch naming,
the merge flow, and versioning, and
[`docs/REPO_POLICY.md`](docs/REPO_POLICY.md) for commit conventions and
code standards. In short:

1. Branch `feat/<name>` from `main`
2. Keep `lint` · `typecheck` · `build` green
3. Squash-merge with a Conventional Commit title
4. Add a CHANGELOG bullet under **Unreleased**
