import type { ReactNode } from "react";
import ScrollText from "@/components/ui/ScrollText";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
};

/** Shared wrapper so every section has the same gutter, width and spacing. */
export default function Section({ id, eyebrow, title, intro, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto max-w-[var(--content-max)] scroll-mt-8 px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      {eyebrow && (
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-electric">
          {eyebrow}
        </p>
      )}
      <h2 id={`${id}-title`} className="text-gradient mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
        {title}
      </h2>
      {intro && <ScrollText text={intro} className="mt-4 max-w-xl text-lg text-cloud-muted" />}
      {children}
    </section>
  );
}
