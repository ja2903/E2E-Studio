import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/**
 * Finish: HDR render → bloom (high threshold, so only the bright core glows)
 * → ACES tone mapping (OutputPass) → fine film grain.
 * These come with three.js itself (examples folder), not an extra package.
 */
export function createPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, isPhone: boolean) {
  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.25, 0.55);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const grain = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.035 }, uBase: { value: new THREE.Vector3(2 / 255, 7 / 255, 10 / 255) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform float uAmount;
      uniform vec3 uBase; // brand midnight, added after tone mapping so it stays exact
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec4 c = texture2D(tDiffuse, vUv);
        float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0) - 0.5;
        gl_FragColor = vec4(c.rgb + uBase + n * uAmount, 1.0);
      }
    `,
  });
  composer.addPass(grain);

  return {
    setSize(w: number, h: number) {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      // Bloom is soft anyway: run it smaller on phones to save battery.
      if (isPhone) bloom.setSize(w / 2, h / 2);
    },
    render(t: number) {
      grain.uniforms.uTime.value = t;
      composer.render();
    },
    dispose() {
      composer.dispose();
      bloom.dispose();
    },
  };
}
