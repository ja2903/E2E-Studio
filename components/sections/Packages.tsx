import Section from "./Section";
import { packages } from "@/lib/content";
import TiltCard from "@/components/ui/TiltCard";
import CountUp from "@/components/ui/CountUp";

export default function Packages() {
  return (
    <Section
      id="packages"
      eyebrow="Packages"
      title="Clear prices. No surprises."
      intro="Every business is different, so these are starting points. We'll confirm a fixed price on our free call."
    >
      <ul className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
        {packages.map((p) => (
          <li key={p.name} className={`tilt-wrap ${p.featured ? "md:-translate-y-4" : ""}`}>
            <TiltCard
              className={`price-card card flex h-full flex-col p-7 ${p.featured ? "price-featured glow-ring" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-cantaloupe px-3 py-1 font-heading text-xs font-semibold text-midnight">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-5 font-heading">
                <span className="text-sm text-cloud-muted">from </span>
                <span className={`text-5xl font-semibold ${p.featured ? "text-gradient" : ""}`}>
                  <CountUp value={p.price} />
                </span>
                {p.unit && <span className="text-cloud-muted">{p.unit}</span>}
              </p>
              <p className="mt-3 text-cloud-muted">{p.summary}</p>
              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {p.items.map((item, i) => (
                  <li key={item} className="price-item flex gap-3" style={{ "--i": i } as React.CSSProperties}>
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0">
                      <circle cx="10" cy="10" r="9" fill="rgb(2 151 222 / 0.18)" />
                      <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="var(--electric)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-cloud-muted">
        Need help with social media too? Management is available as an add-on, quoted case by case.
      </p>
    </Section>
  );
}
