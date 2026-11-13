"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Text that lights up word by word as you scroll past it (framer-motion, driven by scroll position).
 * Server HTML and reduced motion show plain, fully visible text; the effect only switches on after mount.
 */
function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

export default function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.45"] });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setLive(true);
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {live
        ? words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))
        : text}
    </p>
  );
}
