import Section from "./Section";
import { stops } from "@/lib/content";

export default function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="One studio, start to finish."
      intro="Four steps, one team. Pick the ones you need, or let us take care of the whole journey."
    >
      <ol className="mt-14 grid gap-12">
        {stops.map((stop, i) => (
          // data-stop: the 3D engine frames this step's ribbon node and sets --reveal from scroll
          <li
            key={stop.id}
            id={`stop-${stop.id}`}
            data-stop={stop.id}
            className={`flex min-h-[60svh] max-w-md items-center gap-5 md:min-h-[40vh] ${i % 2 ? "md:ml-auto" : ""}`}
          >
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-electric font-heading text-sm font-semibold text-electric"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-2xl font-semibold">{stop.name}</h3>
              <p className="mt-2 text-cloud-muted">{stop.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
