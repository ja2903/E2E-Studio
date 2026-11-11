import Section from "./Section";
import { stops } from "@/lib/content";
import SpotlightCard from "@/components/bits/SpotlightCard";

/* Small, decorative visuals: one per step. Motion is CSS; --reveal (0..1, set from scroll) builds them in. */

function BrandVisual() {
  const swatches = ["bg-midnight ring-1 ring-white/20", "bg-electric", "bg-cantaloupe", "bg-cloud"];
  return (
    <div className="grid h-full grid-cols-[1.2fr_1fr] gap-3">
      <div className="build grid place-items-center rounded-xl border border-white/10 bg-midnight/70" style={{ "--n": 0 } as React.CSSProperties}>
        <svg viewBox="0 0 100 100" className="w-2/3">
          <path d="M14 86 C 44 86, 56 14, 86 14" fill="none" stroke="#0297DE" strokeWidth="6" strokeLinecap="round" pathLength={1} className="draw-on" />
          <circle cx="14" cy="86" r="9" fill="#FC734D" />
          <circle cx="86" cy="14" r="9" fill="#0297DE" />
        </svg>
      </div>
      <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">
        <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
          {swatches.map((s, i) => (
            <span key={s} className={`build min-h-0 rounded-lg ${s}`} style={{ "--n": i + 1 } as React.CSSProperties} />
          ))}
        </div>
        <div className="build rounded-lg border border-white/10 bg-midnight/70 px-3 py-2" style={{ "--n": 5 } as React.CSSProperties}>
          <p className="font-heading text-3xl font-semibold leading-none">Aa</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-cloud-muted">Your type</p>
        </div>
      </div>
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="relative h-full">
      <div className="build absolute inset-y-0 left-0 right-[22%] overflow-hidden rounded-xl border border-white/15 bg-midnight/80" style={{ "--n": 0 } as React.CSSProperties}>
        <div className="flex gap-1 border-b border-white/10 px-3 py-2">
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="size-1.5 rounded-full bg-white/30" />
          <span className="size-1.5 rounded-full bg-white/30" />
        </div>
        <div className="site-scroll p-3">
          <div className="h-16 rounded-md bg-gradient-to-br from-electric/80 to-electric/10" />
          <div className="mt-3 h-2 w-3/4 rounded bg-white/40" />
          <div className="mt-1.5 h-2 w-1/2 rounded bg-white/20" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
          </div>
          <div className="mt-3 h-4 w-16 rounded-full bg-electric" />
          <div className="mt-3 h-16 rounded-md bg-gradient-to-br from-cantaloupe/50 to-transparent" />
        </div>
      </div>
      {/* Phone */}
      <div className="build absolute bottom-0 right-0 h-[85%] w-[34%] overflow-hidden rounded-2xl border-2 border-white/25 bg-midnight p-1.5 shadow-[0_20px_40px_-15px_var(--electric)]" style={{ "--n": 2 } as React.CSSProperties}>
        <div className="h-[35%] rounded-lg bg-gradient-to-br from-electric/80 to-electric/10" />
        <div className="mt-2 h-1.5 w-3/4 rounded bg-white/40" />
        <div className="mt-1 h-1.5 w-1/2 rounded bg-white/20" />
        <div className="mt-2 h-3 w-2/3 rounded-full bg-electric" />
      </div>
    </div>
  );
}

function BookingsVisual() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <div className="build h-full rounded-xl border border-white/10 bg-midnight/80 p-3" style={{ "--n": 0 } as React.CSSProperties}>
      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-cloud-muted">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {Array.from({ length: 15 }, (_, i) => (
          <span
            key={i}
            className={`build h-7 rounded-md ${i === 7 ? "slot-booked grid place-items-center text-[10px] font-bold" : i % 4 === 1 ? "bg-white/5" : "bg-white/10"}`}
            style={{ "--n": 1 + (i % 5) * 0.4 } as React.CSSProperties}
          >
            {i === 7 ? "✓" : null}
          </span>
        ))}
      </div>
      <div className="build mt-3 flex items-center justify-between rounded-lg bg-electric px-3 py-2 font-heading text-xs font-semibold text-midnight" style={{ "--n": 4 } as React.CSSProperties}>
        <span>Wed 10:30 · Booked</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  );
}

function CareVisual() {
  const checks = ["Updated", "Backed up", "Checked"];
  return (
    <div className="grid h-full grid-cols-[1fr_1fr] gap-3">
      <div className="build grid place-items-center rounded-xl border border-white/10 bg-midnight/80" style={{ "--n": 0 } as React.CSSProperties}>
        <div className="care-ring grid size-24 place-items-center rounded-full">
          <span className="live-dot scale-150" />
        </div>
      </div>
      <ul className="grid content-center gap-2">
        {checks.map((c, i) => (
          <li
            key={c}
            className="build flex items-center gap-2 rounded-lg border border-white/10 bg-midnight/80 px-3 py-2 font-heading text-sm font-semibold"
            style={{ "--n": i + 1 } as React.CSSProperties}
          >
            <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-electric text-[10px] text-midnight">✓</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

const visuals = { brand: BrandVisual, website: WebsiteVisual, bookings: BookingsVisual, care: CareVisual };

export default function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="One studio, start to finish."
      intro="Four steps, one team. Pick the ones you need, or let us take care of the whole journey."
    >
      <ol className="mt-10 grid">
        {stops.map((stop, i) => {
          const Visual = visuals[stop.id];
          return (
            // data-stop: the 3D engine frames this step's ribbon node and sets --reveal from scroll
            <li
              key={stop.id}
              id={`stop-${stop.id}`}
              data-stop={stop.id}
              className={`flex min-h-[85svh] items-center md:min-h-[75vh] ${i % 2 ? "md:justify-end" : ""}`}
            >
              {/* React Bits SpotlightCard: a soft blue light follows the cursor */}
              <SpotlightCard
                role="article"
                className="step-card glass w-full max-w-md p-5 sm:p-6"
                spotlightColor="#0297de"
                intensity={0.22}
                spotlightSize={260}
                borderGlow={0.8}
                style={
                  {
                    "--spotlight-card-surface": "transparent",
                    "--spotlight-card-border": "rgb(245 247 248 / 0.12)",
                    "--spotlight-card-shadow": "0 30px 60px -30px rgb(2 151 222 / 0.35)",
                  } as React.CSSProperties
                }
              >
                <div aria-hidden="true" className="h-48 sm:h-52">
                  <Visual />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span aria-hidden="true" className="step-num font-heading text-5xl font-semibold leading-none">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold">{stop.name}</h3>
                    <p className="mt-1 text-sm text-cloud-muted">{stop.line}</p>
                  </div>
                </div>
              </SpotlightCard>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
