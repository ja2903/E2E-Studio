import Image from "next/image";
import SceneCanvas from "@/components/three/SceneCanvas";
import Section from "@/components/sections/Section";

const placeholder = <p className="mt-4 text-cloud-muted">[PLACEHOLDER]</p>;

export default function Home() {
  return (
    // overflow-x: clip, never hidden (guide lesson 01)
    <main className="relative overflow-x-clip">
      <SceneCanvas />

      <div className="relative z-10">
        <header className="mx-auto flex min-h-svh max-w-[var(--content-max)] flex-col justify-center px-[var(--space-gutter)]">
          <h1>
            <Image
              src="/brand/logo-full-dark.svg"
              alt="E2E Studio"
              width={718}
              height={144}
              priority
              className="h-auto w-64 sm:w-96"
            />
          </h1>
          <p className="mt-6 font-heading text-xl sm:text-2xl">
            Your brand, online. <span className="font-semibold">End to End.</span>
          </p>
          {placeholder}
          <a
            href="#book"
            className="mt-8 inline-flex w-fit rounded-full bg-electric px-6 py-3 font-heading font-semibold text-midnight"
          >
            Book a free call
          </a>
        </header>

        <Section id="how" title="How it works">{placeholder}</Section>
        <Section id="packages" title="Packages">{placeholder}</Section>
        <Section id="work" title="Example work">{placeholder}</Section>
        <Section id="book" title="Book a free call">{placeholder}</Section>

        <footer className="mx-auto max-w-[var(--content-max)] px-[var(--space-gutter)] py-12 text-sm text-cloud-muted">
          © E2E Studio
        </footer>
      </div>
    </main>
  );
}
