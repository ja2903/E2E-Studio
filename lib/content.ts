// All page copy that is likely to change lives here, so it's easy to edit.

export const stops = [
  {
    id: "brand",
    name: "Brand",
    line: "A logo and colours that look like you.",
  },
  {
    id: "website",
    name: "Website",
    line: "A quick, clear site that works on every phone.",
  },
  {
    id: "bookings",
    name: "Bookings",
    line: "Customers book or order online, any time.",
  },
  {
    id: "care",
    name: "Care",
    line: "We keep it all running, so you don't have to.",
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
