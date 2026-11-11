import Image from "next/image";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#packages", label: "Packages" },
  { href: "#work", label: "Work" },
];

/** Slim bar fixed to the top. Glass background so text stays readable over the 3D. */
export default function Nav() {
  return (
    <nav aria-label="Main" className="nav-bar fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 max-w-[var(--content-max)] items-center justify-between gap-6 px-[var(--space-gutter)]">
        <a href="#top" aria-label="E2E Studio, back to top" className="shrink-0">
          <Image src="/brand/logo-full-dark.svg" alt="" width={718} height={144} className="h-auto w-28" />
        </a>
        <ul className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-quiet font-normal text-cloud-muted hover:text-cloud">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#book" className="btn-primary min-h-10 px-5 text-sm">
          Book a free call
        </a>
      </div>
    </nav>
  );
}
