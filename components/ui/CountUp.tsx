"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValueEvent, useScroll } from "framer-motion";

/**
 * Counts a price like "£350" up from 0 the first time it scrolls into view.
 * Triggered by scroll position (framer-motion useScroll), not IntersectionObserver.
 * Server HTML shows the final price; it only resets to 0 if it starts off-screen and motion is allowed.
 * Also sets data-armed / data-in on the closest .price-card so its list can build in (CSS).
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useRef(false);
  const [text, setText] = useState(value);
  const parts = value.match(/^(\D*)(\d+)(.*)$/);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.85"] });

  useEffect(() => {
    const el = ref.current;
    if (!el || !parts || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.85) return; // already on screen: leave it
    armed.current = true;
    setText(`${parts[1]}0${parts[3]}`);
    el.closest(".price-card")?.setAttribute("data-armed", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!armed.current || p < 1 || !parts) return;
    armed.current = false;
    ref.current?.closest(".price-card")?.setAttribute("data-in", "");
    const target = Number(parts[2]);
    animate(0, target, {
      duration: 1.1,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setText(`${parts[1]}${Math.round(v)}${parts[3]}`),
    });
  });

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
