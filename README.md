# Natural Wild

An interactive 3D scroll-driven forest journey — drift from the firefly-lit
forest floor, up through the golden canopy, across a hidden river, into the
sunset finale.

## Stack

- Next.js 16 + React 19 + TypeScript (App Router)
- Three.js via @react-three/fiber + drei (procedural low-poly forest)
- anime.js v4 (text reveals & micro-animations)
- @splinetool/react-spline (interactive hero scene)

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

## Swap in your own Spline scene

The hero currently loads a public demo scene. To use your own:

1. Design a scene at https://spline.design (see `spline-prompt.txt` for a
   ready-made AI prompt + manual guide).
2. In the Spline editor: **Export → Code → React**, copy the generated URL.
3. Replace `DEMO_SCENE_URL` in `components/Hero.tsx`.

Objects named `Sun`, `Leaves`, or `Fireflies` in your scene can be driven by
code later via the `onLoad` callback.

## Structure

```
app/                 layout, page, global styles
components/
  Hero.tsx           Spline hero section (swap URL here)
  JourneyCanvas.tsx  fixed R3F canvas (client-only)
  Experience.tsx     page orchestrator
  NavDots.tsx        chapter progress dots
  overlay/
    ChapterText.tsx  animated chapter cards (anime.js)
  scene/
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
