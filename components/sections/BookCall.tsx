import Section from "./Section";
import { needs } from "@/lib/content";

const field =
  "mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-cloud placeholder:text-cloud-muted/60 focus:border-electric focus:outline-none";
const label = "block font-heading text-sm font-semibold";

// Layout only. Sending (env CONTACT_EMAIL) and the Warp orb arrive in Stage 5.
export default function BookCall() {
  return (
    <Section
      id="book"
      eyebrow="Book a free call"
      title="Let's talk about your business."
      intro="A relaxed chat about where you are and what would help. No pressure, no jargon."
    >
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        {/* Space for the Warp orb (Stage 5). The 3D ribbon ends here (data-orb). */}
        <div
          data-orb
          aria-hidden="true"
          className="mx-auto aspect-square w-full max-w-xs rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--electric),var(--midnight)_70%)] opacity-80"
        />

        <form className="card grid gap-5 p-6 sm:p-8" aria-label="Book a free call">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Your name
              <input className={field} name="name" autoComplete="name" required />
            </label>
            <label className={label}>
              Business name
              <input className={field} name="business" autoComplete="organization" required />
            </label>
            <label className={label}>
              Email
              <input className={field} type="email" name="email" autoComplete="email" required />
            </label>
            <label className={label}>
              Phone <span className="font-normal text-cloud-muted">(optional)</span>
              <input className={field} type="tel" name="phone" autoComplete="tel" />
            </label>
          </div>

          <fieldset>
            <legend className={label}>What do you need?</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {needs.map((n) => (
                <label
                  key={n}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 has-[:checked]:border-electric has-[:checked]:bg-electric/15"
                >
                  <input type="checkbox" name="needs" value={n} className="size-4 accent-[var(--electric)]" />
                  {n}
                </label>
              ))}
            </div>
          </fieldset>

          <label className={label}>
            Message
            <textarea className={`${field} min-h-32`} name="message" />
          </label>

          <button type="submit" className="btn-primary w-full sm:w-fit">
            Book my free call
          </button>
        </form>
      </div>
    </Section>
  );
}
