"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Section from "./Section";
import { packages, extras, type LayerKind } from "@/lib/packages";
import TiltCard from "@/components/ui/TiltCard";
import CountUp from "@/components/ui/CountUp";

const LAYER_ROWS = 4; // every stack reserves 4 rows, so stacks line up across cards

const layerClass: Record<LayerKind, string> = {
  brand: "pkg-layer-brand",
  website: "pkg-layer-website",
  bookings: "pkg-layer-bookings",
  custom: "pkg-layer-custom",
};

const formatPrice = (n: number) => `£${n.toLocaleString("en-GB")}`;

/**
 * Packages carousel: native CSS scroll-snap (no library, no scroll-jacking).
 * Arrows, step dots and arrow keys move one card; swipe / trackpad scroll natively.
 * data-lenis-prevent-horizontal lets sideways trackpad gestures scroll the row instead of Lenis.
 */
export default function Packages() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const cards = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const card = cards()[Math.max(0, Math.min(packages.length - 1, i))];
    if (!track || !card) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }, []);

  // Current card = the one whose left edge is closest to the track's left edge.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let best = 0;
      let bestDist = Infinity;
      cards().forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: packages.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    goTo(keys[e.key]);
  };

  return (
    <Section
      id="packages"
      eyebrow="Packages"
      title="Four packages. Each one adds a layer."
      intro="Start where your business is today, and move up when you're ready."
    >
      {/* Controls: step dots + arrows */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <ol className="flex items-center gap-1" aria-label="Packages">
          {packages.map((p, i) => (
            <li key={p.step}>
              <button
                type="button"
                className="pkg-dot"
                aria-label={`${p.step} ${p.name}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                {p.step}
              </button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <button
            type="button"
            className="pkg-arrow"
            aria-label="Previous package"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
              <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="pkg-arrow"
            aria-label="Next package"
            disabled={active === packages.length - 1}
            onClick={() => goTo(active + 1)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
              <path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="pkg-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Packages. Use the left and right arrow keys to move between them."
        data-lenis-prevent-horizontal
        onKeyDown={onKeyDown}
      >
        {packages.map((p) => (
          <li
            key={p.name}
            className="pkg-slide tilt-wrap"
            aria-roledescription="slide"
            aria-label={`${p.step} of 0${packages.length}: ${p.name}`}
          >
            <TiltCard className={`price-card pkg-card ${p.popular ? "pkg-popular" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-heading text-sm tabular-nums text-cloud-muted">{p.step}</p>
                {p.popular && (
                  <span className="rounded-full bg-electric px-3 py-1 font-heading text-xs font-semibold text-midnight">
                    Most popular
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{p.name}</h3>
              <p className="mt-2 font-heading text-lg font-medium text-electric">{p.tagline}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-heading">
                <p>
                  <span className="text-cloud-muted">from </span>
                  <span className={`text-4xl font-semibold ${p.popular ? "text-gradient" : ""}`}>
                    <CountUp value={formatPrice(p.price)} />
                  </span>
                </p>
                <span className="pkg-pill">{p.turnaround}</span>
              </div>
              <p className="mt-3 text-cloud-muted">
                <span className="text-cloud">Best for:</span> {p.bestFor}
              </p>

              <div className="mt-6 border-t border-[rgb(245_247_248/0.14)] pt-6">
                {p.includesHeading && <p className="mb-3 text-sm text-cloud-muted">{p.includesHeading}</p>}
                <ul className="space-y-3">
                  {p.items.map((item, n) => (
                    <li key={item} className="price-item flex gap-3" style={{ "--i": n } as CSSProperties}>
                      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0">
                        <circle cx="10" cy="10" r="9" fill="rgb(2 151 222 / 0.18)" />
                        <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="var(--electric)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                {p.note && <p className="mt-4 text-sm text-cloud-muted">{p.note}</p>}
              </div>

              {/* Layer stack: what this package adds, bottom (brand) to top (custom) */}
              <div className="mt-auto pt-8">
                <p className="sr-only">Layers included: {p.layers.map((l) => l.label).join(", ")}</p>
                <ul
                  aria-hidden="true"
                  className="pkg-stack"
                  style={{ "--rows": LAYER_ROWS } as CSSProperties}
                >
                  {p.layers.map((l) => (
                    <li key={l.kind} className={`pkg-layer ${layerClass[l.kind]}`}>
                      {l.label}
                    </li>
                  ))}
                </ul>
                <a href="#book" className="pkg-cta">
                  Book a free call
                </a>
              </div>
            </TiltCard>
          </li>
        ))}
      </ul>

      {/* Optional extras */}
      <div className="mt-12">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-cloud-muted">Optional extras</h3>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {extras.map((x) => (
            <li key={x.name} className="pkg-extra">
              <p className="font-heading font-semibold">{x.name}</p>
              <p className="mt-1 font-heading text-sm text-electric">{x.price}</p>
              {x.detail && <p className="mt-2 text-sm text-cloud-muted">{x.detail}</p>}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
