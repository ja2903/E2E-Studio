import Section from "./Section";
import BookForm from "./BookForm";
import WarpOrb from "@/components/ui/WarpOrb";

export default function BookCall() {
  return (
    <Section
      id="book"
      eyebrow="Book a free call"
      title="Let's talk about your business."
      intro="A relaxed chat about where you are and what would help. No pressure, no jargon."
    >
      <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_1.3fr]">
        {/* The living orb. The 3D ribbon ends here (data-orb). */}
        <WarpOrb className="mx-auto w-full max-w-xs" />
        <BookForm />
      </div>
    </Section>
  );
}
