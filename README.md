# Natural Wild

An interactive 3D scroll-driven forest journey — drift from the firefly-lit
forest floor, up through the golden canopy, across a hidden river, into the
sunset finale.

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
    River.tsx         procedural water shader
    SunFinale.tsx     sunset disc + glow
hooks/useJourney.ts  scroll progress hook
lib/                 chapters, camera paths, atmosphere stops, utils
```
