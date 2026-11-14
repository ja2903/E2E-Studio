/**
 * All package content and prices live here, so they're easy to change.
 * Used by components/sections/Packages.tsx.
 */

/** The four layers a package can add, bottom to top. */
export type LayerKind = "brand" | "website" | "bookings" | "custom";

export type Layer = { kind: LayerKind; label: string };

/** A local image in public/packages (width/height are the file's real size). */
export type Visual = { src: string; alt: string; width: number; height: number };

export type Package = {
  step: string; // "01"
  name: string;
  tagline: string; // the one-line difference, shown in blue
  price: number; // "from" price in pounds
  turnaround: string;
  bestFor: string;
  /** e.g. "Everything in Launch, plus:" (only on packages that build on another) */
  includesHeading?: string;
  items: string[]; // max 8
  note?: string; // small extra line under the checklist
  layers: Layer[]; // bottom to top
  popular?: boolean;
  art: Visual; // example mockup shown at the top of the card
};

export const packages: Package[] = [
  {
    step: "01",
    name: "Brand",
    art: { src: "/packages/brand-art.png", width: 1100, height: 836, alt: "Example brand kit for Maple & Co, a made-up bakery: logo, fonts, four brand colours, social post templates and a business card." },
    tagline: "Look the part",
    price: 250,
    turnaround: "1–2 weeks",
    bestFor: "A new brand or a rebrand, no website",
    items: [
      "Logo symbol and versions",
      "Full colour palette",
      "Fonts",
      "Short brand guide",
      "5 social post templates",
      "Business card or flyer",
      "Social profile images",
    ],
    layers: [{ kind: "brand", label: "Brand kit" }],
  },
  {
    step: "02",
    name: "Launch",
    art: { src: "/packages/launch-art.png", width: 1100, height: 987, alt: "Example Launch setup for Maple & Co: a phone-friendly website with call and directions buttons, a Google Business Profile, Instagram and a business email." },
    tagline: "Be found online",
    price: 450,
    turnaround: "2–3 weeks",
    bestFor: "New businesses getting started",
    items: [
      "Brand basics: name-only logo, 2 colours, fonts",
      "1–3 page website, with the words written for you",
      "Domain and business email",
      "Google Business Profile",
      "Instagram and Facebook set up",
      "Basic SEO",
      "Contact form and click-to-call",
      "30-minute handover",
    ],
    note: "Upgrade: full brand kit instead of basics, +£100",
    layers: [
      { kind: "brand", label: "Brand basics" },
      { kind: "website", label: "1–3 page website" },
    ],
  },
  {
    step: "03",
    name: "Grow",
    art: { src: "/packages/grow-art.png", width: 1100, height: 981, alt: "Example booking page for Maple & Co: pick a day and time and pay a £10 deposit, then a text reminder, a Book button on Google and Instagram, and an automatic review request." },
    tagline: "Take bookings and payments",
    price: 900,
    turnaround: "2–3 weeks",
    bestFor: "Businesses ready to take bookings or orders online",
    includesHeading: "Everything in Launch, plus:",
    items: [
      "Full brand kit",
      "Up to 5 pages",
      "Booking workflow set up on an existing tool",
      "Services, deposits and cancellation rules",
      "Reminders and review requests",
      "Online payments",
      "“Book” button on Google and Instagram",
      "1-hour handover",
    ],
    layers: [
      { kind: "brand", label: "Brand kit" },
      { kind: "website", label: "Up to 5 pages" },
      { kind: "bookings", label: "Bookings + payments" },
    ],
    popular: true,
  },
  {
    step: "04",
    name: "Custom",
    art: { src: "/packages/custom-art.png", width: 1100, height: 804, alt: "Example custom dashboard for Maple & Co showing this weekend’s orders, collections, payments and a low-stock alert." },
    tagline: "A system built around how you work",
    price: 2000,
    turnaround: "4–6 weeks",
    bestFor: "Workflows off-the-shelf tools can’t handle",
    includesHeading: "Everything in Grow, plus:",
    items: [
      "Brand guideline",
      "Up to 8 pages",
      "Custom-built booking or ordering system",
      "Custom workflows, like made-to-order forms and collection slots",
      "Admin dashboard",
      "2 training sessions",
      "3 months of Care Plus included",
    ],
    layers: [
      { kind: "brand", label: "Brand guideline" },
      { kind: "website", label: "Up to 8 pages" },
      { kind: "bookings", label: "Bookings + payments" },
      { kind: "custom", label: "Custom system" },
    ],
  },
];

export type Extra = { name: string; price: string; detail?: string; image?: Visual };

export const extras: Extra[] = [
  {
    name: "Signature design",
    price: "from +£500",
    detail: "A one-off build with motion, 3D or interactive parts. Pages don’t set the price, the build does.",
    image: {
      src: "/packages/06-design-level.png",
      width: 2400,
      height: 1200,
      alt: "Design level. Standard is included: clean, fast and on-brand, built from tested layouts, quick to launch and easy to update. Signature, from +£500: a one-off build with motion, scroll effects, 3D or interactive parts. It adds 1–2 weeks and is quoted per project.",
    },
  },
  {
    name: "Care plans",
    price: "£35 or £75/month",
    detail:
      "Care Basic £35/month: hosting, fixes, accounts kept connected. Care Plus £75/month: adds up to 1 hour of edits and a monthly check-in.",
    image: {
      src: "/packages/07-care-plans.png",
      width: 2400,
      height: 1200,
      alt: "Care plans. Care Basic, £35 a month: hosting, security and backups; domain, email and booking tool kept connected; fixes if something breaks. Care Plus, £75 a month: all of that, plus up to 1 hour of small edits a month (prices, menus, hours, offers), a monthly check-in call and replies within 2 working days. Clients own their accounts and pay their tools directly; an all-in option adds tools to the Care fee, plus 10%.",
    },
  },
  {
    name: "Social media management",
    price: "Quoted case by case",
  },
];

/** Side-by-side comparisons shown under the carousel. */
export const comparisons: Visual[] = [
  {
    src: "/packages/08-build-up.png",
    width: 2400,
    height: 1620,
    alt: "How each package builds on the last, shown for a made-up client, Maple & Co. Branding: Brand has the brand kit, Launch has brand basics, Grow has the brand kit, Custom has the brand guideline. Website: Brand has none, Launch has 1–3 pages, Grow has up to 5 pages with a Book button on every page, Google and Instagram, Custom has up to 8 pages for custom orders and customer accounts. Bookings: Launch is contact only (call or contact form), Grow adds bookings and payments on an existing tool, Custom adds a system built for the business, with order forms, collection slots and a dashboard.",
  },
  {
    src: "/packages/09-brand-levels.png",
    width: 2400,
    height: 1665,
    alt: "Three brand levels. Brand basics, in Launch: name as a logo, 2 colours, 2 fonts and a 1-page brand sheet, best for a simple start. Brand kit, in Brand and Grow: adds a symbol and logo versions, a full palette, 5 social posts, a card or flyer and a short 2–4 page guide, best for most small businesses. Brand guideline, in Custom: adds logo rules, how to use colours and text sizes, tone of voice, a photo style guide, 10 social posts, signage and print files, and a full 10–15 page guideline, best for teams, staff, printers or signmakers using the brand.",
  },
];
