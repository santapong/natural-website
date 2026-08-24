export interface Chapter {
  id: string;
  kicker: string;
  title: string;
  body: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "floor",
    kicker: "Chapter I",
    title: "Forest Floor",
    body: "The journey begins where the roots breathe. Ferns unroll in the hush, mushrooms glow at the edges, and fireflies stitch the darkness together.",
  },
  {
    id: "canopy",
    kicker: "Chapter II",
    title: "The Canopy",
    body: "Rising past the crowns, the world turns green-gold. Light falls in slow columns while leaves let go and drift down like small suns.",
  },
  {
    id: "river",
    kicker: "Chapter III",
    title: "Hidden River",
    body: "Below the boughs a secret current runs cold and quick, carrying the forest's whispers toward the fading light.",
  },
  {
    id: "finale",
    kicker: "Finale",
    title: "Where Light Rests",
    body: "The trees open. The sun settles low and gilds every branch — and the wild asks you to stay a little longer.",
  },
];

const CAM_POINTS: [number, number, number][] = [
  [7, 2.4, 30],
  [2, 5.5, 4],
  [-3, 13, -24],
  [3, 6.5, -56],
  [-2, 3.2, -90],
  [0, 4.6, -122],
];

const LOOK_POINTS: [number, number, number][] = [
  [0, 3.2, 8],
  [-4, 9, -16],
  [3, 11, -50],
  [0, 3, -84],
  [4, 2.4, -116],
  [0, 8, -168],
];

import * as THREE from "three";

export const cameraPath = new THREE.CatmullRomCurve3(
  CAM_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const lookPath = new THREE.CatmullRomCurve3(
  LOOK_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const pathSamples = cameraPath.getSpacedPoints(64);
