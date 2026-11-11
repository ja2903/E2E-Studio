import Image from "next/image";

export default function Hero() {
  return (
    <header className="mx-auto grid min-h-svh max-w-[var(--content-max)] items-center gap-12 px-[var(--space-gutter)] py-16 md:grid-cols-[1.2fr_1fr]">
      <div>
        <h1>
          <Image
            src="/brand/logo-full-dark.svg"
            alt="E2E Studio"
            width={718}
            height={144}
            priority
            className="h-auto w-60 sm:w-96"
          />
        </h1>
        <p className="mt-8 font-heading text-2xl font-light sm:text-4xl">
          Your brand, online. <span className="font-semibold text-electric">End to End.</span>
        </p>
        <p className="mt-5 max-w-lg text-lg text-cloud-muted">
          We help small local businesses look the part and get booked: brand, website, online
          bookings and ongoing care, all from one friendly studio.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href="#book" className="btn-primary">
            Book a free call
          </a>
          <a href="#packages" className="link-quiet">
            See packages
          </a>
        </div>
      </div>

      {/* Reduced-motion / no-WebGL fallback. With 3D on it is hidden, and the ribbon is framed to this box. */}
      <Image
        src="/brand/flow-mark.svg"
        alt=""
        width={100}
        height={100}
        className="static-mark mx-auto hidden w-full max-w-sm md:block"
      />
    </header>
  );
}
