import Link from "next/link";

/**
 * Result pages for the booking form's no-JavaScript fallback (app/api/book/route.ts),
 * used by app/booking/sent and app/booking/failed. Visitors with scripts running never
 * see these; the form shows its own message instead.
 */
const PAGES = {
  sent: {
    title: "Thanks, we've got it.",
    body: "We'll be in touch soon to find a time that suits you.",
    link: "Back to E2E Studio",
    href: "/",
  },
  failed: {
    title: "Sorry, that didn't send.",
    body: "Please check your name, business name and email, then try again in a few minutes.",
    link: "Back to the form",
    href: "/#book",
  },
} as const;

export const bookingMeta = { title: "Book a free call · E2E Studio", robots: { index: false } };

export default function BookingResult({ status }: { status: keyof typeof PAGES }) {
  const page = PAGES[status];
  return (
    <main className="grid min-h-svh place-items-center px-4 py-16">
      <div className="card grid max-w-md gap-4 p-6 text-center sm:p-8">
        <h1 className="text-2xl font-semibold">{page.title}</h1>
        <p className="text-cloud-muted">{page.body}</p>
        <Link href={page.href} className="btn-primary mx-auto w-fit">
          {page.link}
        </Link>
      </div>
    </main>
  );
}
