import SceneCanvas from "@/components/three/SceneCanvas";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Packages from "@/components/sections/Packages";
import ExampleWork from "@/components/sections/ExampleWork";
import BookCall from "@/components/sections/BookCall";
import Footer from "@/components/sections/Footer";
import ClickSpark from "@/components/bits/ClickSpark";

export default function Home() {
  return (
    // overflow-x: clip, never hidden (guide lesson 01)
    <main className="relative overflow-x-clip">
      {/* Logo loader while the 3D compiles (shown via .loading-3d from layout.tsx, home page only) */}
      <div className="loader" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-full-dark.svg" alt="" width={240} height={48} className="loader-logo" loading="eager" fetchPriority="high" />
      </div>
      <SceneCanvas />
      <Nav />
      {/* React Bits ClickSpark: small blue and orange sparks on click (mouse only) */}
      <ClickSpark sparkColor={["#0297de", "#7fd3ff", "#fc734d"]} sparkCount={9} sparkRadius={26} sparkSize={10} duration={450}>
      <div className="relative z-10">
        <Hero />
        <HowItWorks />
        <Packages />
        <ExampleWork />
        <BookCall />
        <Footer />
      </div>
      </ClickSpark>
    </main>
  );
}
