# Changelog

All notable changes to **Natural Wild** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [SemVer](https://semver.org/).

## [Unreleased]

### Planned
- Deploy pipeline (Vercel) + preview URLs per PR
- Collision walls for free-walk mode

## [0.8.0] — 2026-08-24

### Added
- **Seed Sanctuary** — one-screen physics playground: drag & release to toss
  glowing wish-seeds (gravity, bounce, spin); settled seeds sprout into a
  grove of up to 26 tiny glowing trees; landing-predictor ring, wish counter,
  grove reset (`components/sanctuary/`)
- **Anatomy of a Tree** reworked to a single interactive screen: slider +
  play/pause drive the exploded tree, camera orbits past 62 %, and clicking
  any part opens a detail panel with description and stats

## [0.7.0] — 2026-08-24

### Added
- **Anatomy of a Tree** — scroll-driven exploded view section in the style
  of animejs.com: seven staggered tree parts pull apart like an engineering
  diagram, then the camera orbits; labels fade in per part
  (`components/anatomy/`, `hooks/useSectionProgress.ts`)

## [0.6.0] — 2026-08-24

### Added
- **World map mode** — 🗺️ button pulls the camera into a fog-thinned sky
  view of all ten biomes as pulsing beacon pillars with clickable labels;
  selecting a beacon teleports the scroll journey there
  (`components/scene/WorldMap.tsx`, `MapRig.tsx`)

## [0.5.1] — 2026-08-24

### Fixed
- GLSL shader error `'color' : redefinition` in the autumn leaf-rain shader
  (manual attribute declaration conflicted with `vertexColors`)
- Camera path clipped through waterfall rock towers — veil moved off-centre,
  trail rerouted through an open channel beside it
- Fjord walls and alpine spires pulled back from the flight corridor;
  forest trees now stop before the autumn zone

### Added
- Documentation: `docs/3d-website-types.md` — all 20 types of 3D websites
  and 16 visual styles reference

## [0.5.0] — 2026-08-24

### Added
- **Free-walk mode** — pointer-lock WASD exploration of the whole world:
  spawn where the journey left off, yaw-only movement, head bob, run key,
  world bounds, page-scroll lock while walking
  (`components/scene/FreeWalkRig.tsx`)

## [0.4.1] — 2026-08-24

### Changed
- README expanded: modes, wildlife list, structure map

## [0.4.0] — 2026-08-24

### Added
- Three more biomes: **Autumn Woodland** (amber trees + leaf rain),
  **Alpine Peaks** (snow-capped spires, cloud deck), **Savanna**
  (acacias, termite mounds) → ten chapters total, world depth z −440
- Wildlife: butterflies, deer (grazing/idle), rabbit (hop + sniff), leaping
  fish with splash rings, gull & swallow flocks, breaching whale with spout,
  eagles over the peaks, arctic fox, giraffe, camel

### Changed
- Existing biomes shifted deeper via wrapper groups; forest dressing
  constrained to its zone; journey height raised to 1400vh

## [0.3.0] — 2026-08-24

### Added
- Journey extended to seven chapters: Forest Floor · Canopy · Mirror Lake ·
  The Falling Veil · The Fjord · White Silence · The Golden Sand
- New scenes: `Lake.tsx` calm water shader, `Waterfall.tsx` (twin towers,
  scrolling veil, spray, foam pool), `Fjord.tsx` (basalt walls, dark water),
  `Tundra.tsx` (snowfall, shrubs), `Desert.tsx` (dunes, cacti)
- Atmosphere stops rewritten for biome-to-biome colour travel
- Old `River.tsx` retired

## [0.2.0] — 2026-08-24

### Added
- Procedural golden-hour hero scene replaces the Spline demo:
  `HeroScene.tsx` (instanced pines/oaks, sun glow, god rays, mist,
  fireflies, falling leaves, mouse-parallax camera)

### Removed
- `@splinetool/react-spline` and `@splinetool/runtime` dependencies

## [0.1.0] — 2026-08-24

### Added
- Initial public commit: Next.js 16 + React 19 + TypeScript scaffold
- Scroll-driven rail journey through a low-poly forest (4 chapters) built
  with @react-three/fiber: instanced trees, rocks, mushrooms, fireflies,
  falling leaves, mist planes, god rays, river shader, sunset finale
- anime.js v4 text reveals (hero + chapter cards), NavDots progress
- Repo created at `santapong/natural-website`

[Unreleased]: https://github.com/santapong/natural-website/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/santapong/natural-website/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/santapong/natural-website/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/santapong/natural-website/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/santapong/natural-website/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/santapong/natural-website/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/santapong/natural-website/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/santapong/natural-website/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/santapong/natural-website/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/santapong/natural-website/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/santapong/natural-website/releases/tag/v0.1.0
