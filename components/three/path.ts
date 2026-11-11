import * as THREE from "three";

/**
 * The ribbon's route through the scene (world units, y = down the page).
 * It starts as the flow mark (M14 86 C 44 86, 56 14, 86 14, scaled to world),
 * then winds down past the four stops and ends at the booking orb.
 */
const s = (x: number, y: number, z = 0) => new THREE.Vector3((x - 50) / 15, (50 - y) / 15, z);

export const MARK_START = s(14, 86);
export const MARK_END = s(86, 14);
export const MARK_CENTER = new THREE.Vector3(0, 0, 0);
export const MARK_SIZE = 5.6; // world height of the mark, used to frame it in the hero

// Stop positions, in page order: brand, website, bookings, care.
export const STOP_POINTS = [
  new THREE.Vector3(2.6, -10, 0.6),
  new THREE.Vector3(-2.6, -20, -0.6),
  new THREE.Vector3(2.6, -30, 0.6),
  new THREE.Vector3(-2.6, -40, -0.6),
];

export const END_POINT = new THREE.Vector3(0, -56, 0);

export function buildPath() {
  const path = new THREE.CurvePath<THREE.Vector3>();
  // 1. The flow mark itself.
  path.add(new THREE.CubicBezierCurve3(MARK_START, s(44, 86), s(56, 14), MARK_END));
  // 2. The journey: leaves the mark heading right, then winds down through the stops.
  path.add(
    new THREE.CatmullRomCurve3(
      [
        MARK_END,
        new THREE.Vector3(4.2, 2.6, -0.4),
        new THREE.Vector3(5, -2.5, -1.2),
        new THREE.Vector3(4, -7, 0),
        STOP_POINTS[0],
        new THREE.Vector3(0, -15, 1.4),
        STOP_POINTS[1],
        new THREE.Vector3(0, -25, -1.4),
        STOP_POINTS[2],
        new THREE.Vector3(0, -35, 1.4),
        STOP_POINTS[3],
        new THREE.Vector3(-1.5, -46, 0.8),
        new THREE.Vector3(1.2, -51, -0.6),
        END_POINT,
      ],
      false,
      "centripetal",
    ),
  );
  return path;
}

/** Arc-length lookup table, so particles and nodes can sample the path cheaply. */
export function sampleTable(path: THREE.CurvePath<THREE.Vector3>, count: number) {
  const points = path.getSpacedPoints(count - 1);
  return points;
}

/** Arc-length position (0..1) on the path closest to a point. */
export function nearestU(points: THREE.Vector3[], p: THREE.Vector3) {
  let best = 0;
  let bestD = Infinity;
  points.forEach((q, i) => {
    const d = q.distanceToSquared(p);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best / (points.length - 1);
}

/**
 * Gentle sway. The same maths runs in the ribbon's vertex shader (SWAY_GLSL)
 * so particles and nodes stay glued to the ribbon.
 */
export const SWAY = 0.14;
export function sway(u: number, t: number, out: THREE.Vector3) {
  return out.set(
    Math.sin(u * 37 + t * 0.6),
    Math.cos(u * 29 + t * 0.5),
    Math.sin(u * 23 + t * 0.4),
  ).multiplyScalar(SWAY);
}
export const SWAY_GLSL = /* glsl */ `
  vec3 sway(float u, float t) {
    return vec3(sin(u * 37.0 + t * 0.6), cos(u * 29.0 + t * 0.5), sin(u * 23.0 + t * 0.4)) * ${SWAY.toFixed(3)};
  }
`;
