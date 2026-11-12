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
    const root = document.documentElement;
    // The logo loader (layout.tsx) covers the page while shaders compile; drop it on any failure.
    const endLoader = () => root.classList.remove("loading-3d");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return endLoader();

    let engine: { dispose(): void } | null = null;
    let cancelled = false;
    const loaderCap = window.setTimeout(endLoader, 4000); // never hold the page longer than this

    import("./engine")
      .then(async ({ createEngine }) => {
        if (cancelled) return;
        const e = createEngine(canvas);
        engine = e;
        await e.start();
        if (cancelled) return;
        root.classList.add("has-3d");
        endLoader();
      })
      .catch((err) => {
        // No WebGL: the static page still works.
        console.warn("3D scene unavailable:", err);
        endLoader();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(loaderCap);
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
