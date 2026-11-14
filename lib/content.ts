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

export const needs = ["Brand", "Website", "Bookings", "Care"] as const;
