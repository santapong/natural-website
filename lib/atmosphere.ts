import * as THREE from "three";

interface Stop {
  t: number;
  color: string;
  density: number;
  light: string;
  intensity: number;
}

const STOPS: Stop[] = [
  // I forest floor
  { t: 0.0, color: "#0b2418", density: 0.03, light: "#cfe8d2", intensity: 1.1 },
  // II canopy
  { t: 0.1, color: "#12351f", density: 0.02, light: "#e9ffd9", intensity: 1.25 },
  // III autumn woodland
  { t: 0.2, color: "#3a2410", density: 0.02, light: "#ffd9a0", intensity: 1.35 },
  // IV mirror lake
  { t: 0.3, color: "#0d3034", density: 0.018, light: "#bfffe9", intensity: 1.15 },
  // V waterfall mist
  { t: 0.4, color: "#2c474c", density: 0.032, light: "#dff5f2", intensity: 1.25 },
  // VI fjord
  { t: 0.5, color: "#14262e", density: 0.02, light: "#a9ccd6", intensity: 1.05 },
  // VII alpine peaks
  { t: 0.6, color: "#1c2733", density: 0.014, light: "#cfe2f5", intensity: 1.3 },
  // VIII tundra
  { t: 0.7, color: "#26333e", density: 0.012, light: "#dbe9f5", intensity: 1.3 },
  // IX savanna
  { t: 0.8, color: "#4a3a12", density: 0.014, light: "#ffe1a0", intensity: 1.45 },
  // X golden sand finale
  { t: 0.9, color: "#5c2f10", density: 0.017, light: "#ffa854", intensity: 1.55 },
  { t: 1.0, color: "#6b3410", density: 0.02, light: "#ff9a45", intensity: 1.6 },
];

const colors = STOPS.map((s) => ({
  ...s,
  c: new THREE.Color(s.color),
  l: new THREE.Color(s.light),
}));

export interface AtmosphereSample {
  fogColor: THREE.Color;
  density: number;
  lightColor: THREE.Color;
  intensity: number;
}

const scratch: AtmosphereSample = {
  fogColor: new THREE.Color(),
  density: 0,
  lightColor: new THREE.Color(),
  intensity: 1,
};

export function sampleAtmosphere(t: number): AtmosphereSample {
  const p = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1].t) i++;
  const a = colors[i];
  const b = colors[i + 1];
  const span = b.t - a.t || 1;
  const f = Math.min(1, Math.max(0, (p - a.t) / span));
  scratch.fogColor.lerpColors(a.c, b.c, f);
  scratch.lightColor.lerpColors(a.l, b.l, f);
  scratch.density = a.density + (b.density - a.density) * f;
  scratch.intensity = a.intensity + (b.intensity - a.intensity) * f;
  return scratch;
}
