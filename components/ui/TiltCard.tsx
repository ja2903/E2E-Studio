"use client";

import { useRef, type ReactNode } from "react";

/**
 * Tilts towards the mouse with a soft light, like a card in your hand.
 * Mouse only (no tilt on touch); reduced motion turns the transform off in CSS (.tilt).
 */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    ref.current.style.setProperty("--gx", `${x * 100}%`);
    ref.current.style.setProperty("--gy", `${y * 100}%`);
    ref.current.dataset.active = "";
  };
  const leave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
    delete ref.current.dataset.active;
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>
      {children}
      <span aria-hidden="true" className="tilt-glare" />
    </div>
  );
}
