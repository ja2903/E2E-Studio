/**
 * All package content and prices live here, so they're easy to change.
 * Used by components/sections/Packages.tsx.
 */

/** The four layers a package can add, bottom to top. */
export type LayerKind = "brand" | "website" | "bookings" | "custom";

export type Layer = { kind: LayerKind; label: string };

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
};

export const packages: Package[] = [
  {
    step: "01",
    name: "Brand",
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

export type Extra = { name: string; price: string; detail?: string };

export const extras: Extra[] = [
  {
    name: "Signature design",
    price: "from +£500",
    detail: "A one-off build with motion, 3D or interactive parts. Pages don’t set the price, the build does.",
  },
  {
    name: "Care plans",
    price: "£35 or £75/month",
    detail:
      "Care Basic £35/month: hosting, fixes, accounts kept connected. Care Plus £75/month: adds up to 1 hour of edits and a monthly check-in.",
  },
  {
    name: "Social media management",
    price: "Quoted case by case",
  },
];
