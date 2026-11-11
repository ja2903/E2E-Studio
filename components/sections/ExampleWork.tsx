import Image from "next/image";
import Section from "./Section";

const posts = [
  { src: "/work/cake-candle-insta-1.jpg", alt: "Instagram post: What I make, listing cakes, candles and hampers" },
  { src: "/work/cake-candle-insta-2.jpg", alt: "Instagram post: How to order, in four simple steps" },
  { src: "/work/cake-candle-insta-3.jpg", alt: "Instagram post announcing the new name, The Cake and Candle Co." },
];

function BrowserFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-white/15 bg-midnight shadow-2xl ${className}`}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
      </div>
      <Image src={src} alt={alt} width={1440} height={900} sizes="(min-width: 768px) 40vw, 90vw" className="h-auto w-full" />
    </figure>
  );
}

export default function ExampleWork() {
  return (
    <Section
      id="work"
      eyebrow="Example work"
      title="The Cake and Candle Co."
      intro="Two small Hatfield businesses became one brand, with a website and Instagram to match."
    >
      <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
        <div className="grid gap-5">
          <div className="card grid place-items-center p-6">
            <Image
              src="/work/cake-candle-logo.svg"
              alt="The Cake and Candle Co. logo"
              width={632}
              height={478}
              className="h-auto w-full max-w-[13rem]"
            />
          </div>
          <ul className="flex flex-wrap gap-2 text-sm" aria-label="What we made">
            {["Brand", "Website", "Instagram"].map((t) => (
              <li key={t} className="rounded-full border border-electric/50 px-3 py-1 font-heading font-semibold text-electric">
                {t}
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-3 gap-2">
            {posts.map((p) => (
              <li key={p.src} className="overflow-hidden rounded-lg border border-white/10">
                <Image src={p.src} alt={p.alt} width={1080} height={1350} sizes="(min-width: 768px) 12vw, 30vw" className="h-auto w-full" />
              </li>
            ))}
          </ul>
        </div>

        {/* Two pages of the site, stacked for depth */}
        <div className="relative pb-[12%] pr-[8%]">
          <BrowserFrame src="/work/cake-candle-site-home.png" alt="The Cake and Candle Co. website home page" />
          <BrowserFrame
            src="/work/cake-candle-site-order.png"
            alt="The Cake and Candle Co. website order page"
            className="absolute bottom-0 right-0 w-[55%] ring-1 ring-electric/40"
          />
        </div>
      </div>
    </Section>
  );
}
