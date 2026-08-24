# Natural Wild

An interactive 3D scroll-driven journey through ten wild places — drift
from the firefly-lit forest floor, up through the golden canopy, into an
autumn woodland, skim across a mirror lake, fly through a waterfall, thread
a dark fjord, soar over alpine peaks, cross the silent tundra and endless
grass, and end on golden sand at sunset.

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
lib/                 chapters, camera paths, atmosphere stops, utils
```
