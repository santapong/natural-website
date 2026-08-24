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
    id: "lake",
    kicker: "Chapter III",
    title: "Mirror Lake",
    body: "The trees fall away and the sky opens below your feet. You skim low across still water that carries the whole horizon on its back.",
  },
  {
    id: "waterfall",
    kicker: "Chapter IV",
    title: "The Falling Veil",
    body: "A wall of stone ahead — and the river pours itself off the world in ribbons of light. Mist rises like breath from the pool below.",
  },
  {
    id: "fjord",
    kicker: "Chapter V",
    title: "The Fjord",
    body: "You slip between cliffs older than memory. Basalt shoulders lean close, the water runs black and patient, and echoes do the talking.",
  },
  {
    id: "tundra",
    kicker: "Chapter VI",
    title: "White Silence",
    body: "North of everything, snow takes the sound away. Lichen shrubs hold their breath under a pale sky and the wind writes and rewrites the drifts.",
  },
  {
    id: "desert",
    kicker: "Finale",
    title: "The Golden Sand",
    body: "The last miles burn amber. Dunes roll like a frozen sea toward a sun too wide to watch — and the wild asks you to stay a little longer.",
  },
];

const CAM_POINTS: [number, number, number][] = [
  [7, 2.4, 30],
  [2, 5.5, 4],
  [-3, 13, -24],
  [1, 6, -42],
  [-1.5, 1.6, -58],
  [1.5, 1.8, -76],
  [0, 3.4, -90],
  [0, 6.2, -102],
  [-2, 5.5, -118],
  [0, 6.5, -140],
  [2, 7, -162],
  [-1, 5.5, -184],
  [0, 3, -204],
  [-2, 2.9, -226],
  [1, 3.3, -250],
  [0, 4.2, -274],
  [0, 5, -296],
];

const LOOK_POINTS: [number, number, number][] = [
  [0, 3.2, 8],
  [-4, 9, -16],
  [3, 11, -50],
  [0, 3.4, -66],
  [0, 1.9, -84],
  [0, 2.8, -98],
  [0, 9, -120],
  [0, 12, -132],
  [0, 9, -148],
  [0, 10, -168],
  [0, 9, -190],
  [0, 5, -212],
  [0, 3.2, -235],
  [0, 3, -260],
  [0, 5, -285],
  [0, 8, -315],
  [0, 12, -345],
];

import * as THREE from "three";

export const cameraPath = new THREE.CatmullRomCurve3(
  CAM_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const lookPath = new THREE.CatmullRomCurve3(
  LOOK_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const pathSamples = cameraPath.getSpacedPoints(64);
