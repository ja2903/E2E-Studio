import Image from "next/image";
import Section from "./Section";

const posts = [
  { src: "/work/cake-candle-insta-1.jpg", alt: "Instagram post: What I make, listing cakes, candles and hampers" },
  { src: "/work/cake-candle-insta-2.jpg", alt: "Instagram post: How to order, in four simple steps" },
  { src: "/work/cake-candle-insta-3.jpg", alt: "Instagram post announcing the new name, The Cake and Candle Co." },
];

function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="card overflow-hidden">
      <div aria-hidden="true" className="flex gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
      </div>
      <Image src={src} alt={alt} width={1440} height={900} className="h-auto w-full" />
    </figure>
  );
}

export default function ExampleWork() {
  return (
    <Section
      id="work"
      eyebrow="Example work"
      title="The Cake and Candle Co."
      intro="Eggless bakes and hand-decorated candles, made to order in Hatfield. Two small businesses became one brand, with a website and Instagram to match."
    >
      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="card grid place-items-center p-10">
          <Image
            src="/work/cake-candle-logo.svg"
            alt="The Cake and Candle Co. logo"
            width={632}
            height={478}
            className="h-auto w-full max-w-xs"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold">Brand</h3>
          <p className="mt-2 text-cloud-muted">
            A new name and logo bringing a bakery and a candle business together under one roof,
            with a warm, celebratory look that suits both.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6">
        <div>
          <h3 className="text-2xl font-semibold">Website</h3>
          <p className="mt-2 max-w-xl text-cloud-muted">
            Customers browse cakes, candles and hampers, then send everything as one order
            request. The owner checks her diary and confirms before anything is paid.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <BrowserFrame src="/work/cake-candle-site-home.png" alt="The Cake and Candle Co. website home page" />
          <BrowserFrame src="/work/cake-candle-site-order.png" alt="The Cake and Candle Co. website order page" />
        </div>
      </div>

      <div className="mt-16 grid gap-6">
        <div>
          <h3 className="text-2xl font-semibold">Instagram</h3>
          <p className="mt-2 max-w-xl text-cloud-muted">
            A launch set of pinned posts that explain the menu, how to order and the new name.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-3 sm:gap-5">
          {posts.map((p) => (
            <li key={p.src} className="card overflow-hidden">
              <Image src={p.src} alt={p.alt} width={1080} height={1350} className="h-auto w-full" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
