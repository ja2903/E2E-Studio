import SceneCanvas from "@/components/three/SceneCanvas";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Packages from "@/components/sections/Packages";
import ExampleWork from "@/components/sections/ExampleWork";
import BookCall from "@/components/sections/BookCall";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    // overflow-x: clip, never hidden (guide lesson 01)
    <main className="relative overflow-x-clip">
      <SceneCanvas />
      <div className="relative z-10">
        <Hero />
        <HowItWorks />
        <Packages />
        <ExampleWork />
        <BookCall />
        <Footer />
      </div>
    </main>
  );
}
