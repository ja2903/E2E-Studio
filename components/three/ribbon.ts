import * as THREE from "three";
import { SWAY_GLSL } from "./path";

const CANTALOUPE = new THREE.Color("#fc734d");
const ELECTRIC = new THREE.Color("#0297de");

/**
 * A twisted, glowing ribbon along the path. Geometry holds the centre line plus
 * a transported frame. The shader adds width, twist, sway and the "unspool"
 * cut-off (uReveal), so nothing is rebuilt per frame.
 */
export function createRibbon(points: THREE.Vector3[]) {
  const n = points.length;
  const center = new Float32Array(n * 2 * 3);
  const sideA = new Float32Array(n * 2 * 3); // in-plane width direction
  const sideB = new Float32Array(n * 2 * 3); // out-of-plane direction
  const along = new Float32Array(n * 2);
  const across = new Float32Array(n * 2);

  const tangent = new THREE.Vector3();
  const w = new THREE.Vector3();
  const b = new THREE.Vector3();
  const zAxis = new THREE.Vector3(0, 0, 1);
  let prevW: THREE.Vector3 | null = null;

  for (let i = 0; i < n; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[Math.min(n - 1, i + 1)];
    tangent.subVectors(p1, p0).normalize();
    // Width points sideways in the screen plane so we mostly see the ribbon's face.
    w.crossVectors(tangent, zAxis);
    if (w.lengthSq() < 1e-6) w.set(1, 0, 0);
    w.normalize();
    if (prevW && w.dot(prevW) < 0) w.negate(); // avoid sudden flips
    prevW = w.clone();
    b.crossVectors(tangent, w).normalize();

    for (let k = 0; k < 2; k++) {
      const v = i * 2 + k;
      points[i].toArray(center, v * 3);
      w.toArray(sideA, v * 3);
      b.toArray(sideB, v * 3);
      along[v] = i / (n - 1);
      across[v] = k === 0 ? -1 : 1;
    }
  }

  const index: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(center, 3));
  geometry.setAttribute("aSideA", new THREE.BufferAttribute(sideA, 3));
  geometry.setAttribute("aSideB", new THREE.BufferAttribute(sideB, 3));
  geometry.setAttribute("aAlong", new THREE.BufferAttribute(along, 1));
  geometry.setAttribute("aAcross", new THREE.BufferAttribute(across, 1));
  geometry.setIndex(index);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -26, 0), 40);

  // Shared uniforms: the engine updates these once per frame.
  const uniforms = {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uDim: { value: 1 },
    uColorA: { value: CANTALOUPE },
    uColorB: { value: ELECTRIC },
  };

  const make = (width: number, strength: number, core: number) =>
    new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uWidth: { value: width }, uStrength: { value: strength }, uCore: { value: core } },
      vertexShader: /* glsl */ `
        attribute vec3 aSideA;
        attribute vec3 aSideB;
        attribute float aAlong;
        attribute float aAcross;
        uniform float uTime;
        uniform float uWidth;
        varying float vAlong;
        varying float vAcross;
        varying float vFacing;
        ${SWAY_GLSL}
        void main() {
          float twist = aAlong * 34.0 + uTime * 0.35;     // slow, continuous twist
          vec3 side = aSideA * cos(twist) + aSideB * sin(twist);
          float taper = smoothstep(0.0, 0.012, aAlong) * (1.0 - smoothstep(0.985, 1.0, aAlong));
          vec3 pos = position + sway(aAlong, uTime) + side * aAcross * uWidth * (0.35 + 0.65 * taper);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          // How face-on the ribbon is: edges turned toward us read brighter.
          vec3 normal = normalize(normalMatrix * (aSideA * -sin(twist) + aSideB * cos(twist)));
          vFacing = abs(dot(normal, normalize(-mv.xyz)));
          vAlong = aAlong;
          vAcross = aAcross;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uReveal;
        uniform float uDim;
        uniform float uStrength;
        uniform float uCore;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vAlong;
        varying float vAcross;
        varying float vFacing;
        void main() {
          if (vAlong > uReveal) discard;
          float soft = 1.0 - vAcross * vAcross;
          float core = exp(-vAcross * vAcross * 18.0) * uCore;
          float tip = smoothstep(0.0, 0.006, uReveal - vAlong);  // soft fade at the unspooling tip
          float head = exp(-(uReveal - vAlong) * 160.0) * tip;
          vec3 col = mix(uColorA, uColorB, smoothstep(0.015, 0.075, vAlong));
          float edge = mix(1.6, 0.8, vFacing);
          vec3 c = col * (soft * edge + core) + vec3(0.9, 0.95, 1.0) * core * 0.35 + col * head * 1.5;
          gl_FragColor = vec4(c * uStrength * uDim * tip, 1.0);
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

  const group = new THREE.Group();
  const halo = new THREE.Mesh(geometry, make(0.55, 0.07, 0));
  const body = new THREE.Mesh(geometry, make(0.16, 0.55, 1));
  group.add(halo, body);

  return {
    group,
    uniforms,
    dispose() {
      geometry.dispose();
      (halo.material as THREE.Material).dispose();
      (body.material as THREE.Material).dispose();
    },
  };
}

/** Soft round glow used for particles, stop nodes and the two dots. */
export function glowTexture() {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export { CANTALOUPE, ELECTRIC };
