"use client";

import { useEffect, useRef } from "react";

/**
 * The one fixed, full-screen 3D canvas behind every HTML section.
 * three.js loads after the page, so the text is never held up.
 * Reduced motion or no WebGL: the engine never starts and the static mark stays.
 */
export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let engine: { dispose(): void } | null = null;
    let cancelled = false;
    const root = document.documentElement;

    import("./engine")
      .then(async ({ createEngine }) => {
        if (cancelled) return;
        const e = createEngine(canvas);
        engine = e;
        await e.start();
        if (cancelled) return;
        root.classList.add("has-3d");
      })
      .catch((err) => {
        // No WebGL: the static page still works.
        console.warn("3D scene unavailable:", err);
      });

    return () => {
      cancelled = true;
      root.classList.remove("has-3d");
      engine?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="scene-canvas pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
