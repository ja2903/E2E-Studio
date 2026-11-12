import * as THREE from "three";
import Lenis from "lenis";
import {
  buildPath,
  sampleTable,
  nearestU,
  sway,
  MARK_CENTER,
  MARK_END,
  MARK_SIZE,
  STOP_POINTS,
  END_POINT,
} from "./path";
import { createRibbon, glowTexture, ringTexture, CANTALOUPE, ELECTRIC } from "./ribbon";
import { createPost } from "./post";

/**
 * The 3D engine. One clock (THREE.Timer) drives everything: the ribbon, the
 * particles, the camera and the HTML step reveals. Scroll position (smoothed)
 * picks a spot between camera cues; each cue frames its target by SIZE (how many
 * world units fill the screen), so it looks the same on any screen.
 * Lenis (smooth wheel scrolling) runs on the same clock, so page and ribbon move together.
 * Blueprint mode: `data-blueprint` on <html> (set by the footer switch).
 */

type Cue = {
  scroll: number; // page scroll (px) where this cue is exactly on
  target: THREE.Vector3; // what we're looking at
  height: number; // visible world height on screen
  ox: number; // where the target sits on screen (-1..1, 0 = centre)
  oy: number;
  reveal: number; // how much ribbon is unspooled (0..1)
  dim: number; // ribbon brightness (lower behind busy text)
};

const FOV = 35;
const TABLE_SIZE = 1600;
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function createEngine(canvas: HTMLCanvasElement) {
  const isPhone = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  // Clear to black: the post chain adds the midnight base back at the very end (post.ts),
  // because clearing to midnight inside the HDR chain came out teal.
  renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isPhone ? 1.75 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 400);
  const timer = new THREE.Timer();
  timer.connect(document);
  const post = createPost(renderer, scene, camera, isPhone);

  // --- Pointer: the ribbon and particles lean toward it, the camera drifts with it.
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, active: 0, target: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    pointer.target = 1;
  };
  const onPointerEnd = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") pointer.target = 0; // phones: only while touching
  };
  const onLeave = () => (pointer.target = 0);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const pointerWorld = new THREE.Vector3();
  const ndc = new THREE.Vector2();

  // --- Ribbon ---------------------------------------------------------------
  const path = buildPath();
  const table = sampleTable(path, TABLE_SIZE);
  const ribbon = createRibbon(table);
  scene.add(ribbon.group);

  const markEndU = nearestU(table, MARK_END);
  const stopU = STOP_POINTS.map((p) => nearestU(table, p));

  const pointAt = (u: number, t: number, out: THREE.Vector3) => {
    const f = clamp01(u) * (TABLE_SIZE - 1);
    const i = Math.min(TABLE_SIZE - 2, Math.floor(f));
    out.lerpVectors(table[i], table[i + 1], f - i);
    out.add(sway(u, t, tmp2));
    return bend(out);
  };
  // Same maths as BEND_GLSL in ribbon.ts: pull gently toward the pointer.
  const bend = (p: THREE.Vector3) => {
    const strength = ribbon.uniforms.uPointerStrength.value;
    if (strength < 0.001) return p;
    tmp3.subVectors(ribbon.uniforms.uPointer.value, p);
    const d2 = tmp3.lengthSq();
    const r = ribbon.uniforms.uPointerRadius.value;
    return p.addScaledVector(tmp3, Math.exp(-d2 / (r * r)) * strength);
  };
  const tmp3 = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();

  // --- Glows: stop nodes, start dot (cantaloupe), end dot (blue) -------------
  const glow = glowTexture();
  const ring = ringTexture();
  const sprite = (color: THREE.Color, scale: number, map = glow) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    s.scale.setScalar(scale);
    scene.add(s);
    return s;
  };
  const white = new THREE.Color(0xdff3ff);
  const bpBlue = new THREE.Color(0x73c7ff);
  const nodes = stopU.map((u) => ({ u, halo: sprite(ELECTRIC, 2.4), core: sprite(white, 0.45), ring: sprite(bpBlue, 1.1, ring) }));
  const startDot = sprite(CANTALOUPE, 1.3);
  const startCore = sprite(new THREE.Color(0xffd2c4), 0.35);
  const endDot = sprite(ELECTRIC, 3.2);
  const endCore = sprite(white, 0.6);
  const endRing = sprite(bpBlue, 1.6, ring);
  const startRing = sprite(bpBlue, 0.8, ring);

  // --- Particles flowing start -> end ----------------------------------------
  const COUNT = isPhone ? 160 : 280;
  const pPos = new Float32Array(COUNT * 3);
  const pCol = new Float32Array(COUNT * 3);
  const seeds = Array.from({ length: COUNT }, () => ({
    u0: Math.random(),
    speed: 0.006 + Math.random() * 0.01,
    off: new THREE.Vector3().randomDirection().multiplyScalar(0.08 + Math.random() * 0.3),
  }));
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  pGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -26, 0), 40);
  const pMat = new THREE.PointsMaterial({
    size: 0.16,
    map: glow,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(pGeo, pMat));
  const pColor = new THREE.Color();

  // --- Dust: faint motes through the whole scene, for depth ------------------
  const DUST = isPhone ? 350 : 900;
  const dPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dPos[i * 3] = (Math.random() - 0.5) * 34;
    dPos[i * 3 + 1] = 8 - Math.random() * 72;
    dPos[i * 3 + 2] = -14 + Math.random() * 18;
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dMat = new THREE.PointsMaterial({
    size: 0.07,
    map: glow,
    color: new THREE.Color(0x4fb6ea).multiplyScalar(0.55),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dust = new THREE.Points(dGeo, dMat);
  scene.add(dust);

  // --- Camera cues, measured from the real page layout -----------------------
  let cues: Cue[] = [];
  let stopEls: { el: HTMLElement; anchor: number }[] = [];
  let vw = 1;
  let vh = 1;

  const root = document.documentElement;
  const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
  const ndcX = (el: Element) => {
    const r = el.getBoundingClientRect();
    return ((r.left + r.width / 2) / vw) * 2 - 1;
  };

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    post.setSize(vw, vh);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();

    const aspect = vw / vh;
    const desktop = vw >= 768;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    // Visible height that fits `w` world units across the screen width.
    const fitWidth = (w: number) => w / aspect;
    const next: Cue[] = [];

    // Hero: the ribbon sits where the static mark is (desktop) or low behind the text (phone).
    const mark = document.querySelector(".static-mark");
    const markRect = mark?.getBoundingClientRect();
    if (markRect && markRect.height > 0) {
      const top = markRect.top + window.scrollY;
      next.push({
        scroll: 0,
        target: MARK_CENTER.clone(),
        height: (MARK_SIZE * vh) / markRect.height,
        ox: ndcX(mark!),
        oy: 1 - (2 * (top + markRect.height / 2)) / vh,
        reveal: markEndU,
        dim: desktop ? 1 : 0.7,
      });
    } else {
      next.push({ scroll: 0, target: MARK_CENTER.clone(), height: fitWidth(8.5), ox: 0, oy: -0.62, reveal: markEndU, dim: 0.55 });
    }

    // The four stops: node sits opposite its text on desktop, above it on phones.
    stopEls = [];
    document.querySelectorAll<HTMLElement>("[data-stop]").forEach((el, i) => {
      if (!STOP_POINTS[i]) return;
      const anchor = Math.min(maxScroll, docTop(el) + el.offsetHeight / 2 - vh / 2);
      stopEls.push({ el, anchor });
      const card = el.querySelector(".step-card") ?? el;
      next.push({
        scroll: anchor,
        target: STOP_POINTS[i].clone(),
        height: desktop ? 8 : fitWidth(7),
        ox: desktop ? (ndcX(card) < 0 ? 0.42 : -0.42) : 0,
        oy: desktop ? 0 : 0.55,
        reveal: stopU[i] + 0.004,
        dim: desktop ? 1 : 0.7,
      });
    });

    // Packages + example work: pull back so the ribbon becomes a quiet line behind the cards.
    const packages = document.getElementById("packages");
    const work = document.getElementById("work");
    const lastStop = stopU[stopU.length - 1];
    if (packages) {
      next.push({
        scroll: Math.min(maxScroll, docTop(packages)),
        target: table[Math.round((lastStop + (1 - lastStop) * 0.35) * (TABLE_SIZE - 1))].clone(),
        height: desktop ? 20 : fitWidth(14),
        ox: 0,
        oy: 0,
        reveal: lastStop + (1 - lastStop) * 0.45,
        dim: 0.14,
      });
    }
    if (work) {
      next.push({
        scroll: Math.min(maxScroll, docTop(work) + work.offsetHeight * 0.6),
        target: table[Math.round((lastStop + (1 - lastStop) * 0.75) * (TABLE_SIZE - 1))].clone(),
        height: desktop ? 20 : fitWidth(14),
        ox: 0,
        oy: 0,
        reveal: lastStop + (1 - lastStop) * 0.85,
        dim: 0.14,
      });
    }

    // The booking orb: the ribbon ends on it, framed to the orb's size.
    const orb = document.querySelector("[data-orb]");
    const orbRect = orb?.getBoundingClientRect();
    if (orb && orbRect && orbRect.height > 0) {
      const top = orbRect.top + window.scrollY;
      const scroll = Math.min(maxScroll, top + orbRect.height / 2 - vh / 2);
      next.push({
        scroll,
        target: END_POINT.clone(),
        height: (3.4 * vh) / orbRect.height,
        ox: ndcX(orb),
        oy: 1 - (2 * (top - scroll + orbRect.height / 2)) / vh,
        reveal: 1,
        dim: desktop ? 1 : 0.75,
      });
    }

    next.sort((a, b) => a.scroll - b.scroll);
    cues = next;
  }

  // --- Per-frame -------------------------------------------------------------
  const view = { target: new THREE.Vector3(), height: 1, ox: 0, oy: 0, reveal: 0, dim: 1 };
  const look = new THREE.Vector3();
  let scroll = window.scrollY;
  let lenis: Lenis | null = null;
  let bp = root.hasAttribute("data-blueprint") ? 1 : 0;

  function sampleCues(s: number) {
    if (!cues.length) return;
    let i = 0;
    while (i < cues.length - 2 && s > cues[i + 1].scroll) i++;
    const a = cues[i];
    const b = cues[Math.min(i + 1, cues.length - 1)];
    const span = b.scroll - a.scroll;
    const f = span > 0 ? smooth(clamp01((s - a.scroll) / span)) : 1;
    view.target.lerpVectors(a.target, b.target, f);
    view.height = THREE.MathUtils.lerp(a.height, b.height, f);
    view.ox = THREE.MathUtils.lerp(a.ox, b.ox, f);
    view.oy = THREE.MathUtils.lerp(a.oy, b.oy, f);
    view.reveal = THREE.MathUtils.lerp(a.reveal, b.reveal, f);
    view.dim = THREE.MathUtils.lerp(a.dim, b.dim, f);
    // Past the last cue the page keeps moving: keep the end glued to the orb.
    if (s > b.scroll) view.oy += (2 * (s - b.scroll)) / vh;
  }

  function tick(timestamp: number) {
    timer.update(timestamp);
    const dt = Math.min(timer.getDelta(), 0.1);
    const t = timer.getElapsed();

    // Lenis eases the page itself on this clock; the ribbon reads the same scroll, so they never drift apart.
    lenis?.raf(timestamp);
    scroll = window.scrollY;
    sampleCues(scroll);
    bp += ((root.hasAttribute("data-blueprint") ? 1 : 0) - bp) * (1 - Math.exp(-dt * 5));
    const glowK = 1 - bp * 0.85; // glows mostly fade out in blueprint

    // Intro: the mark draws itself in over ~2s on load.
    const intro = smooth(clamp01((t - 0.2) / 2));
    const reveal = view.reveal * intro;

    // Camera: frame `height` world units, with the target at (ox, oy) on screen.
    const dist = view.height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    look.copy(view.target);
    look.x -= (view.ox * view.height * camera.aspect) / 2;
    look.y -= (view.oy * view.height) / 2;
    const k = 1 - Math.exp(-dt * 4);
    pointer.sx += (pointer.x - pointer.sx) * k;
    pointer.sy += (pointer.y - pointer.sy) * k;
    pointer.active += (pointer.target - pointer.active) * k;
    const par = view.height * 0.04; // parallax scales with framing
    camera.position.set(
      look.x + Math.sin(t * 0.15) * 0.25 + pointer.sx * par,
      look.y + Math.cos(t * 0.12) * 0.15 + pointer.sy * par,
      look.z + dist,
    );
    camera.lookAt(look);
    camera.updateMatrixWorld();

    // Where the pointer is, on the plane through what we're looking at.
    ndc.set(pointer.sx, pointer.sy);
    raycaster.setFromCamera(ndc, camera);
    plane.set(new THREE.Vector3(0, 0, 1), -view.target.z);
    if (raycaster.ray.intersectPlane(plane, pointerWorld)) ribbon.uniforms.uPointer.value.copy(pointerWorld);
    ribbon.uniforms.uPointerStrength.value = 0.35 * pointer.active;
    ribbon.uniforms.uPointerRadius.value = view.height * 0.16;
    root.style.setProperty("--px", pointer.sx.toFixed(3));
    root.style.setProperty("--py", pointer.sy.toFixed(3));
    dust.rotation.y = Math.sin(t * 0.03) * 0.05;
    dust.position.y = Math.sin(t * 0.1) * 0.3;

    ribbon.uniforms.uTime.value = t;
    ribbon.uniforms.uReveal.value = reveal;
    ribbon.uniforms.uDim.value = view.dim;
    ribbon.uniforms.uBlueprint.value = bp;

    // Dots and nodes ride the swaying ribbon.
    const pulse = 0.9 + Math.sin(t * 2) * 0.1;
    pointAt(0, t, tmp);
    startDot.position.copy(tmp);
    startCore.position.copy(tmp);
    startRing.position.copy(tmp);
    startDot.material.opacity = startCore.material.opacity = clamp01(intro * 4) * view.dim * glowK;
    startRing.material.opacity = clamp01(intro * 4) * view.dim * bp;
    nodes.forEach((n) => {
      pointAt(n.u, t, tmp);
      n.halo.position.copy(tmp);
      n.core.position.copy(tmp);
      n.ring.position.copy(tmp);
      const on = smooth(clamp01((reveal - n.u + 0.004) / 0.006));
      n.halo.material.opacity = on * pulse * view.dim * glowK;
      n.core.material.opacity = on * view.dim * glowK;
      n.ring.material.opacity = on * view.dim * bp;
      n.ring.material.rotation = t * 0.2;
      n.halo.scale.setScalar(2.4 * (0.6 + 0.4 * on));
    });
    pointAt(1, t, tmp);
    endDot.position.copy(tmp);
    endCore.position.copy(tmp);
    endRing.position.copy(tmp);
    const endOn = smooth(clamp01((reveal - 0.985) / 0.015));
    endDot.material.opacity = endOn * pulse * glowK;
    endCore.material.opacity = endOn * glowK;
    endRing.material.opacity = endOn * bp;
    endRing.material.rotation = -t * 0.2;

    // Particles: only on the unspooled part, fading near the tip.
    seeds.forEach((p, i) => {
      // Particles loop over the unspooled part only, so the visible ribbon is always busy.
      const u = ((p.u0 + t * p.speed) % 1) * reveal;
      const fade = clamp01((reveal - u) / 0.01) * clamp01(u / 0.004);
      pointAt(u, t, tmp).add(p.off);
      tmp.toArray(pPos, i * 3);
      pColor
        .copy(CANTALOUPE)
        .lerp(ELECTRIC, Math.max(bp, smooth(clamp01((u - 0.015) / 0.06))))
        .multiplyScalar(fade * view.dim * 0.9 * (1 - bp * 0.5));
      pColor.toArray(pCol, i * 3);
    });
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;

    // HTML step reveals, from the same smoothed scroll (not IntersectionObserver).
    for (const s of stopEls) {
      const r = smooth(clamp01((scroll - (s.anchor - vh * 0.55)) / (vh * 0.35)));
      s.el.style.setProperty("--reveal", r.toFixed(3));
    }

    post.render(t);
  }

  // Layout changes (images loading, fonts, resize) re-measure the cues.
  let raf = 0;
  const remeasure = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(measure);
  };
  const ro = new ResizeObserver(remeasure);
  ro.observe(document.body);
  window.addEventListener("resize", remeasure);
  measure();

  return {
    async start() {
      await renderer.compileAsync(scene, camera);
      // Smooth wheel scrolling. Touch keeps the phone's own native scrolling.
      // Menu links glide to their section, landing just under the fixed top bar.
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: { offset: -64 } });
      tick(performance.now());
      renderer.setAnimationLoop(tick);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      lenis?.destroy();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", onPointerEnd);
      root.removeEventListener("pointerleave", onLeave);
      root.style.removeProperty("--px");
      root.style.removeProperty("--py");
      post.dispose();
      dGeo.dispose();
      dMat.dispose();
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
      timer.dispose();
      ribbon.dispose();
      glow.dispose();
      ring.dispose();
      pGeo.dispose();
      pMat.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Sprite) o.material.dispose();
      });
      stopEls.forEach((s) => s.el.style.removeProperty("--reveal"));
      renderer.dispose();
    },
  };
}
