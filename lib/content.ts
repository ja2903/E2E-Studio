// All page copy that is likely to change lives here, so it's easy to edit.

export const stops = [
  {
    id: "brand",
    name: "Brand",
    line: "A name, logo and colours that look like you, ready for signs, socials and print.",
  },
  {
    id: "website",
    name: "Website",
    line: "A clear, quick site that works on every phone and tells people why to choose you.",
  },
  {
    id: "bookings",
    name: "Bookings",
    line: "Customers book or order online, so you spend less time chasing messages.",
  },
  {
    id: "care",
    name: "Care",
    line: "We keep everything running and up to date, so you can get on with the work.",
  },
] as const;

export const packages = [
  {
    name: "Starter",
    price: "£350",
    unit: "",
    summary: "Everything you need to look professional and be found.",
    items: [
      "Brand kit",
      "1–3 page website",
      "Domain name",
      "Google Business Profile",
      "Instagram setup",
    ],
    featured: false,
  },
  {
    name: "Business",
    price: "£750",
    unit: "",
    summary: "Starter, plus the tools that take orders for you.",
    items: [
      "Everything in Starter",
      "Online booking or ordering",
      "Business email",
      "Basic SEO, so local searches find you",
    ],
    featured: true,
  },
  {
    name: "Care plan",
    price: "£40",
    unit: "/month",
    summary: "We look after it, so you never have to think about it.",
    items: ["Hosting", "Upkeep and updates", "Small monthly edits", "A monthly check-in"],
    featured: false,
  },
] as const;

export const needs = ["Brand", "Website", "Bookings", "Care"] as const;
