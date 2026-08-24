# 3D Website Types & Visual Styles — Complete Guide

A reference for every kind of 3D web experience and rendering style,
including what this project (Natural Wild) uses and how to build each one.

---

## Part 1 — Types of 3D Websites (interaction / experience formats)

| # | Type | What it does | Famous examples | Key tech |
|---|------|--------------|-----------------|----------|
| 1 | **Scrollytelling journey** | Story unfolds as you scroll through a 3D world | Natural Wild (this site!), Apple AirPods pages | Scroll progress → camera path on splines |
| 2 | **Exploded view / teardown** | Product pulls apart on scroll to reveal internals | **animejs.com**, iFixit-style guides | Scroll-scrubbed timeline lerping part offsets |
| 3 | **Product configurator** | Change colors/materials/parts live on a model | Nike By You, BMW/Mini builders | Material swaps, UI → uniform/prop binding |
| 4 | **E-commerce 3D viewer** | Spin, zoom, AR "place in your room" | IKEA Place, Sketchfab embeds | OrbitControls, `<model-viewer>`, WebXR AR |
| 5 | **Walkable virtual world** | First-person WASD + mouse-look exploration | Virtual museums, real-estate tours | PointerLockControls, collision geometry |
| 6 | **Browser games** | Full gameplay in the tab | Racing/platformer indie games | Physics engines (Rapier, cannon-es), game loops |
| 7 | **Data visualization** | Live data as explorable 3D | GitHub Globe, network/trade flows | Points/arcs shaders, real data feeds |
| 8 | **Hero scene background** | Mouse-reactive 3D behind normal content | Stripe, Polygon, agency sites | Pointer parallax, lightweight scenes |
| 9 | **Educational simulation** | Explore planets, molecules, anatomy | Solar System Scope, BioDigital Human | OrbitControls, annotated models |
| 10 | **VR / AR (WebXR)** | Headset or phone-camera immersion | Museum VR tours, face filters | WebXR Device API, three.js XR |
| 11 | **Multiplayer social space** | Meet others as avatars in 3D | Gather-style offices, virtual concerts | WebSocket/WebRTC state sync |
| 12 | **Music visualizer** | Scene reacts to audio in real time | Audio-reactive promos | Web Audio API AnalyserNode → shader uniforms |
| 13 | **Digital twin** | Real factory/city mirrored live in 3D | Industrial dashboards, smart cities | IoT streams, instanced geometry |
| 14 | **3D typography** | Text as/exploding-in 3D | Title screens, brand reveals | TextGeometry, troika-three-text |
| 15 | **Shader-art site** | No meshes — full-screen math painting | Shadertoy embeds, art portfolios | Fragment shaders, raymarching SDFs |
| 16 | **Physics playground** | Drag/throw objects with gravity | Sandboxes, toy pages | Rapier/cannon-es, drag controls |
| 17 | **360° panorama** | Look-around photo/video spheres | Hotels, tourism previews | Sphere with inverted texture |
| 18 | **Map / globe experience** | Fly between locations on Earth | Travel sites, news interactives | Globe.gl, Cesium, tile servers |
| 19 | **CSS 3D** | Fake-but-cheap depth without WebGL | Card tilts, flip UIs | CSS `transform: perspective()` |
| 20 | **AI-generated worlds** | Text prompt → instant 3D scene | Emerging gen-3D tools | Text-to-3D models + procedural gen |

**Note:** Real projects mix several types. Natural Wild mixes #1 + #5 + #8
+ wildlife simulation.

---

## Part 2 — 3D Visual Styles (how it *looks*)

| Style | Look | How to build it |
|-------|------|-----------------|
| **Low-poly** ← Natural Wild | Faceted, stylized shapes | `flatShading: true`, simple geometry, no textures |
| **Clay / matte render** | Soft monochrome toy look | High roughness, pastel palette, soft lights |
| **Toon / cel-shaded** | Cartoon bands + outlines | Gradient map shading, inverted-hull outlines |
| **Voxel** | Minecraft-like cube art | Instanced box grids or MagicaVoxel exports |
| **Isometric diorama** | Tilted miniature world scene | Orthographic camera at ~45° |
| **PSX / retro pixel** | Low-res textures, dithering, wobble | Tiny textures, low internal render resolution |
| **Wireframe / neon grid** | Glowing lines, synthwave mood | `wireframe: true`, additive blending, fog |
| **Glassmorphism 3D** | Transparent refracting glass | `MeshPhysicalMaterial` transmission |
| **Holographic / iridescent** | Rainbow sheen that shifts | Fresnel env-map gradient shaders |
| **Liquid / metaballs** | Organic merging blobs | MarchingCubes, fluid simulation |
| **GPU particles / swarms** | Thousands of moving points | Shader-driven Points, InstancedMesh ← fireflies |
| **Exploded view** | Parts pulled apart like diagrams | Scroll timeline lerping part offsets |
| **Photoreal PBR** | Near-real products/scenes | GLTF models, HDRI environment maps |
| **Point cloud / scan** | Laser-survey ghost look | Dense Points built from mesh vertices |
| **ASCII / terminal** | 3D rendered as text characters | ASCII effect renderer pass |
| **Raymarched SDF art** | Dreamy abstract infinite worlds | Full-screen fragment shaders |

---

## Part 3 — What style is the anime.js landing page?

The hero at [animejs.com](https://animejs.com) where the 3D mechanism
disassembles while you scroll is:

### Type: **#2 — Scroll-driven Exploded View ("product teardown")**
### Genre: **Scrollytelling** (scroll + storytelling)

How it works internally:
1. A WebGL (three.js) model is built from separate named parts
2. Scroll position drives a normalized value `0 → 1`
3. Each part interpolates from its **assembled position** to an
   **exploded offset** along an axis (often staggered per part)
4. Usually paired with: camera orbit during the explode phase,
   HUD labels naming each part, and full reversibility when
   scrolling back up

The term comes from **engineering exploded-view diagrams**, where a machine
is drawn pulled apart along one axis so every component is visible.
On the web it's the signature move of premium product-launch pages.

---

## Part 4 — Natural Wild's current recipe

| Ingredient | Choice |
|------------|--------|
| Primary type | Scrollytelling journey (#1) |
| Secondary type | Walkable world (#5) — free-walk mode |
| Tertiary type | Hero scene (#8) — mouse parallax |
| Visual style | Low-poly + GPU particles + shader water/snow |
| Animation | anime.js v4 (DOM/UI) + custom useFrame rigs (3D) |
| Stack | Next.js 16 · React 19 · three.js via @react-three/fiber + drei |
