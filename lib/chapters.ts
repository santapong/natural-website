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
    id: "autumn",
    kicker: "Chapter III",
    title: "Autumn Woodland",
    body: "The forest catches fire without burning. Amber crowns rustle overhead, red leaves rain down, and between the trunks a deer lifts its head to watch you pass.",
  },
  {
    id: "lake",
    kicker: "Chapter IV",
    title: "Mirror Lake",
    body: "The trees fall away and the sky opens below your feet. You skim low across still water — something silver breaks the surface, flashes, and is gone.",
  },
  {
    id: "waterfall",
    kicker: "Chapter V",
    title: "The Falling Veil",
    body: "A wall of stone ahead — and the river pours itself off the world in ribbons of light. Mist rises like breath from the pool below.",
  },
  {
    id: "fjord",
    kicker: "Chapter VI",
    title: "The Fjord",
    body: "You slip between cliffs older than memory. Basalt shoulders lean close, the water runs black and patient, and echoes do the talking.",
  },
  {
    id: "alpine",
    kicker: "Chapter VII",
    title: "Alpine Peaks",
    body: "Up through the cloud deck the world turns to stone and snow. You soar with the wind over spires, gulls riding thermals beside you.",
  },
  {
    id: "tundra",
    kicker: "Chapter VIII",
    title: "White Silence",
    body: "North of everything, snow takes the sound away. Lichen shrubs hold their breath under a pale sky and the wind writes and rewrites the drifts.",
  },
  {
    id: "savanna",
    kicker: "Chapter IX",
    title: "Endless Grass",
    body: "The ice lets go and the land exhales gold. Umbrella trees stand alone in the shimmer while swallows carve loops through the warm air.",
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
  [-2, 3.2, -60],
  [2, 2.6, -78],
  [-1, 2.1, -94],
  [0.5, 1.6, -108],
  [1, 3, -124],
  [0, 6.5, -140],
  [-1.5, 6, -156],
  [0, 6.5, -180],
  [2, 7, -202],
  [-1, 6, -224],
  [0, 9, -242],
  [1, 13, -256],
  [0, 8, -272],
  [-2, 3, -288],
  [0, 2.9, -310],
  [1, 3.4, -330],
  [0, 4, -352],
  [0, 4.6, -374],
  [0, 5.2, -396],
];

const LOOK_POINTS: [number, number, number][] = [
  [0, 3.2, 8],
  [-4, 9, -16],
  [3, 11, -50],
  [-1, 4, -62],
  [1, 2.6, -80],
  [0, 2.4, -96],
  [0, 1.8, -110],
  [0, 1.6, -128],
  [0, 9, -146],
  [0, 13, -158],
  [0, 9, -176],
  [0, 9, -200],
  [0, 9.5, -222],
  [0, 7, -246],
  [0, 12, -270],
  [-1, 11, -290],
  [0, 5, -300],
  [0, 2.6, -314],
  [0, 3, -336],
  [0, 4.5, -360],
  [0, 6, -386],
  [0, 8, -410],
  [0, 12, -440],
];

import * as THREE from "three";

export const cameraPath = new THREE.CatmullRomCurve3(
  CAM_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const lookPath = new THREE.CatmullRomCurve3(
  LOOK_POINTS.map((p) => new THREE.Vector3(...p)),
);

export const pathSamples = cameraPath.getSpacedPoints(64);
