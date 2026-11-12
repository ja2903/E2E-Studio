import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://e2estudio.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "E2E Studio · Your brand, online. End to End.",
  description:
    "E2E Studio builds brands, websites and bookings for small local businesses, then looks after them.",
  openGraph: {
    title: "E2E Studio",
    description: "Your brand, online. End to End.",
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#02070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below adds a class to <html> before React loads.
    <html lang="en-GB" className={`${jakarta.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Show the logo loader only when the 3D will actually start (JS on, motion allowed). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("loading-3d")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <div className="loader" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-full-dark.svg" alt="" width={240} height={48} className="loader-logo" loading="eager" fetchPriority="high" />
        </div>
        {children}
      </body>
    </html>
  );
}
