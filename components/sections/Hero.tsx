import Image from "next/image";
import AnimatedLogo from "@/components/brand/AnimatedLogo";
import ShinyText from "@/components/bits/ShinyText";
import StarBorder from "@/components/bits/StarBorder";
import Magnet from "@/components/bits/Magnet";

/** Words of the headline; each one rises in on load. */
const line1 = ["Your", "brand,", "online."];

/**
 * Small glass cards floating around the 3D ribbon, one per step of the journey.
 * They drift on their own and lean with the cursor (--px/--py, set by the 3D engine).
 */
function FloatCards() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Brand */}
      <div className="float-card left-0 top-[2%] md:left-[-4%]" style={{ "--depth": 18, "--delay": "1.6s" } as React.CSSProperties}>
        <p className="float-label">Brand</p>
        <div className="mt-2 flex gap-1.5">
          <span className="size-6 rounded-md bg-midnight ring-1 ring-white/20" />
          <span className="size-6 rounded-md bg-electric" />
          <span className="size-6 rounded-md bg-cantaloupe" />
          <span className="size-6 rounded-md bg-cloud" />
        </div>
        <p className="mt-2 font-heading text-xl font-semibold leading-none">
          Aa <span className="font-light text-cloud-muted">Aa</span>
        </p>
      </div>

      {/* Website */}
      <div className="float-card right-0 top-[30%] w-32 md:right-[-6%]" style={{ "--depth": 30, "--delay": "1.8s" } as React.CSSProperties}>
        <p className="float-label">Website</p>
        <div className="mt-2 overflow-hidden rounded-md border border-white/15 bg-midnight/60 p-1.5">
          <div className="h-8 rounded bg-gradient-to-br from-electric/70 to-electric/10" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded bg-white/40" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-white/20" />
          <div className="mt-1.5 h-3 w-10 rounded-full bg-electric" />
        </div>
      </div>

      {/* Bookings */}
      <div className="float-card bottom-[4%] right-[4%]" style={{ "--depth": 24, "--delay": "2s" } as React.CSSProperties}>
        <p className="float-label">Bookings</p>
        <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-semibold">
          <span className="rounded bg-white/10 px-1.5 py-1 text-cloud-muted">09:00</span>
          <span className="slot-booked rounded px-1.5 py-1">10:30</span>
          <span className="rounded bg-white/10 px-1.5 py-1 text-cloud-muted">13:00</span>
        </div>
      </div>

      {/* Care */}
      <div className="float-card bottom-[22%] left-0 md:left-[-2%]" style={{ "--depth": 14, "--delay": "2.2s" } as React.CSSProperties}>
        <p className="float-label">Care</p>
        <p className="mt-1.5 flex items-center gap-2 font-heading text-sm font-semibold">
          <span className="live-dot" />
          Site is live
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  let i = 0;
  const word = (w: string, extra = "") => (
    <span key={w + i} className={`hero-word ${extra}`} style={{ "--i": i++ } as React.CSSProperties}>
      {w}
    </span>
  );

  return (
    <header id="top" className="relative mx-auto grid min-h-svh max-w-[var(--content-max)] items-center gap-10 px-[var(--space-gutter)] pb-20 pt-28 md:grid-cols-[1.15fr_1fr] md:pt-24">
      <div>
        <h1>
          <AnimatedLogo className="h-auto w-64 sm:w-[26rem]" />
        </h1>
        <p className="mt-8 font-heading text-[2.6rem] font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">{line1.map((w) => word(w))}</span>
          {/* React Bits ShinyText: a light sweeps across in brand blue */}
          <span className="hero-line block font-semibold">
            <ShinyText color="#0297de" shineColor="#d6f0ff" speed={2.4} delay={3} glow={0.35}>
              End to End.
            </ShinyText>
          </span>
        </p>
        <p className="hero-fade mt-6 max-w-md text-lg text-cloud-muted">
          Brand, website, bookings and care for small local businesses. One friendly studio.
        </p>
        <div className="hero-fade mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ animationDelay: "1.5s" }}>
          {/* React Bits Magnet + StarBorder: the button leans to the cursor, a star circles its edge */}
          <Magnet padding={70} magnetStrength={4} maxOffset={14}>
            <StarBorder
              as="a"
              href="#book"
              radius={999}
              thickness={1.5}
              duration={3.5}
              glow={0.9}
              sparkle
              color="#ffffff"
              trailColor="#7fd3ff"
              backgroundColor="#0297de"
              textColor="#02070a"
              borderColor="rgba(255,255,255,0.25)"
              className="btn-glow min-h-12 px-7 font-heading font-semibold"
            >
              Book a free call
            </StarBorder>
          </Magnet>
          <a href="#packages" className="link-quiet">
            See packages
          </a>
        </div>
      </div>

      {/* The 3D ribbon is framed to this box. Without 3D (reduced motion / no WebGL) the flat mark shows. */}
      <div className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-md">
        <Image src="/brand/flow-mark.svg" alt="" width={100} height={100} className="static-mark h-full w-full" loading="eager" />
        <FloatCards />
      </div>

      <a
        href="#how"
        aria-label="Scroll to how it works"
        className="scroll-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:flex"
      >
        <span />
      </a>
    </header>
  );
}
