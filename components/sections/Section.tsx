import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children?: ReactNode;
};

/** Shared wrapper so every section has the same gutter, width and spacing. */
export default function Section({ id, title, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto min-h-[80vh] max-w-[var(--content-max)] px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
