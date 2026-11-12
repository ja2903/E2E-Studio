"use client";

import { useEffect, useRef, useState } from "react";
import { Warp } from "@paper-design/shaders-react";

/**
 * The booking orb. Adapted from cult-ui "AI Blob Warp" (Paper Design Warp shader),
 * recoloured to the brand. The pulse is CSS (no motion library); the shader pauses
 * when the orb is off-screen or the visitor prefers reduced motion.
 * The 3D ribbon ends here (data-orb is measured by the engine).
 */
const COLORS = ["#02070a", "#0297de", "#04324d", "#0297de", "#02070a", "#fc734d"];

export default function WarpOrb({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => setLive(inView && !reduce.matches);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(el);
    reduce.addEventListener("change", update);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={ref} data-orb aria-hidden="true" className={`warp-orb ${live ? "is-live" : ""} ${className}`}>
      <div className="warp-orb-inner">
        <Warp
          colors={COLORS}
          proportion={0.42}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.12}
          scale={0.6}
          speed={live ? 0.6 : 0}
          maxPixelCount={640 * 640}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
