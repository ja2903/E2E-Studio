"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Moves its children up or down a little as the page scrolls (framer-motion).
 * `speed` is pixels of travel across the whole pass; negative moves against the scroll.
 * Off for reduced motion.
 */
export default function Parallax({ children, speed = 60, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setLive(true);
  }, []);

  return (
    <motion.div ref={ref} style={live ? { y } : undefined} className={className}>
      {children}
    </motion.div>
  );
}
