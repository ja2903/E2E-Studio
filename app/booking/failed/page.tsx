import type { Metadata } from "next";
import BookingResult, { bookingMeta } from "@/components/sections/BookingResult";

export const metadata: Metadata = bookingMeta;

export default function Page() {
  return <BookingResult status="failed" />;
}
