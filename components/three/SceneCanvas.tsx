"use client";

import { useRef } from "react";

/**
 * The one fixed, full-screen 3D canvas that sits behind every HTML section
 * (guide step 02). Stage 3 attaches the three.js engine (ribbon + camera cues) here.
 */
export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
