# Architecture — how Natural Wild works

> Visual overview: [`docs/architecture.svg`](./architecture.svg)

## The core idea

One WebGL canvas travels through a **500-unit-deep world** laid out along the
negative Z axis. Three inputs move the camera through the same world:

| Mode | Input | Camera owner |
|------|-------|--------------|
| Rail journey (default) | page scroll | `CameraRig` samples two Catmull-Rom splines (`cameraPath`, `lookPath`) |
| 🚶 Free walk | WASD + mouse | `FreeWalkRig` (pointer lock, yaw-only movement, head bob) |
| 🗺️ World map | UI button | `MapRig` pulls up to a sky view; beacons teleport the scroll |

`ForestScene` owns the switch: exactly one rig renders per frame, and all
rigs share a `spawn` ref so free-walk starts where scrolling stopped.

## Frame loop

```
requestAnimationFrame
└── @react-three/fiber useFrame (one per animated component)
    ├── CameraRig        → position/lookAt from spline at eased progress
    ├── ForestScene       → fog color/density + light lerp (atmosphere stops)
    ├── biome components  → shader uTime, particle integration
    └── wildlife rigs     → walk cycles, breach arcs, wing flaps
```

Every animated value lives in a **ref** mutated inside `useFrame`. React
re-renders happen only for real UI state: mode switches, panels, counters.

## World layout (Z map)

| Zone | Z range | Component |
|------|---------|-----------|
| Forest floor + canopy | 30 … −50 | Trees/Rocks/Mushrooms/Fireflies |
| Autumn woodland | −52 … −86 | `Autumn`, `Deer`, `Rabbit` |
| Mirror lake | −82 … −126 | `Lake`, `Fish` |
| Waterfall gorge | −125 … −165 | `Waterfall` |
| Fjord | −170 … −230 | `Fjord`, `Whale` |
| Alpine peaks | −232 … −270 | `Alpine` |
| Tundra | −268 … −326 | `Tundra`, `Fox` |
| Savanna | −322 … −362 | `Savanna`, `Giraffe` |
| Desert finale | −366 … −440 | `Desert`, `SunFinale`, `Camel` |

Atmosphere stops in `lib/atmosphere.ts` sit at each chapter boundary and are
lerped by eased progress, so fog and light melt from forest-green to
desert-amber continuously.

## Standalone sections (own canvases)

- **HeroScene** — procedural golden-hour clearing, mouse parallax.
- **TreeAnatomy** — slider/play value drives staggered part offsets
  (exploded view); ≥62 % orbits the camera; labels open an info panel.
- **SeedSanctuary** — DOM drag events queue *commands* into a ref; the R3F
  scene consumes them per frame, integrates gravity/bounce physics
  imperatively, and reports settled seeds back via callback so React can
  render sprouts.

## Performance notes

- Instanced meshes for trees, rocks, shrubs, dunes, walls (draw calls ≈ tens).
- GPU point shaders for fireflies, snow, leaves, spray.
- Fog culls distant detail; map mode thins density instead of disabling it.
- Each extra canvas is `dynamic(..., { ssr: false })` and only mounts when scrolled to.
