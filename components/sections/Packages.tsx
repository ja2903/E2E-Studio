import Section from "./Section";
import { packages } from "@/lib/content";

export default function Packages() {
  return (
    <Section
      id="packages"
      eyebrow="Packages"
      title="Clear prices. No surprises."
      intro="Every business is different, so these are starting points. We'll confirm a fixed price on our free call."
    >
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {packages.map((p) => (
          <li
            key={p.name}
            className={`card flex flex-col p-7 ${p.featured ? "border-electric" : ""}`}
          >
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-4 font-heading">
              <span className="text-sm text-cloud-muted">from </span>
              <span className="text-4xl font-semibold">{p.price}</span>
              {p.unit && <span className="text-cloud-muted">{p.unit}</span>}
            </p>
            <p className="mt-3 text-cloud-muted">{p.summary}</p>
            <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
              {p.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-electric" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-cloud-muted">
        Need help with social media too? Management is available as an add-on, quoted case by case.
      </p>
    </Section>
  );
}
