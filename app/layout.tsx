import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Text, Pinyon_Script, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { BottomNav, TopNav } from "@/components/Nav";
import { Compass } from "@/components/Compass";
import { PlannerBadge } from "@/components/PlannerBadge";
import { Providers } from "@/components/Providers";
import "./globals.css";

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "McAfee-Sandefur Thanksgiving 2026 · Cape San Blas",
  description: "Schedule, map, potluck, and RSVPs for the McAfee-Sandefur Thanksgiving reunion.",
};

export const viewport: Viewport = {
  themeColor: "#1e2a4a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caslon.variable} ${pinyon.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <header className="sticky top-0 z-20 border-b border-navy/10 bg-cream/90 backdrop-blur">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-2 lg:max-w-5xl lg:gap-6">
              <Link href="/" aria-label="Home" className="flex items-center">
                <Compass size={30} className="text-navy" />
              </Link>
              <div className="flex items-center gap-4">
                <TopNav />
                <PlannerBadge />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-5 pb-32 lg:pt-8 lg:pb-16">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
