/**
 * Endless strip of services (taken from the packages, nothing invented).
 * CSS-only: the list is rendered twice and slides by half its width. Pauses on hover.
 * Reduced motion: no animation, the first copy wraps normally and the duplicate is hidden.
 */
const services = [
  "Brand kits",
  "Websites",
  "Online booking",
  "Online ordering",
  "Google Business Profile",
  "Instagram setup",
  "Business email",
  "Local SEO",
  "Hosting",
  "Monthly care",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {services.map((s) => (
        <li key={s} className="flex items-center gap-6">
          <span>{s}</span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-cantaloupe" />
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section aria-label="What we do" className="marquee relative z-10 border-y border-white/10 py-5">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
