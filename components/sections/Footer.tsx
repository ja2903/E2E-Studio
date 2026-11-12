import Image from "next/image";
import BlueprintToggle from "@/components/ui/BlueprintToggle";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-6 px-[var(--space-gutter)] py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Image src="/brand/logo-full-dark.svg" alt="E2E Studio" width={718} height={144} className="h-auto w-36" />
          <p className="mt-3 font-heading text-sm font-light">
            Your brand, online. <span className="font-semibold">End to End.</span>
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-cloud-muted">
          <BlueprintToggle />
          <p>© E2E Studio</p>
        </div>
      </div>
    </footer>
  );
}
