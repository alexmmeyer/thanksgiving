"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CalendarIcon, HomeIcon, MapIcon, TurkeyLegIcon } from "./icons";
import { WaveDivider } from "./WaveDivider";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/schedule", label: "Schedule", Icon: CalendarIcon },
  { href: "/where", label: "Where", Icon: MapIcon },
  { href: "/food", label: "Food", Icon: TurkeyLegIcon },
] as const;

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  if (href === "/schedule") return pathname.startsWith("/schedule") || pathname.startsWith("/rsvp");
  return pathname.startsWith(href);
}

function WithPathname({ render }: { render: (pathname: string | null) => React.ReactNode }) {
  return render(usePathname());
}

function withPathname(render: (pathname: string | null) => React.ReactNode) {
  return (
    <Suspense fallback={render(null)}>
      <WithPathname render={render} />
    </Suspense>
  );
}

/** Phones and tablets: fixed tab bar at the bottom of the screen. */
export function BottomNav() {
  return withPathname((pathname) => (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden" aria-label="Main">
      <WaveDivider className="block h-4 w-full" />
      <ul className="grid grid-cols-4 bg-navy pb-[env(safe-area-inset-bottom)] text-cream">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[0.85rem] font-semibold ${
                  active ? "text-aqua" : "text-cream/80"
                }`}
              >
                <Icon size={26} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  ));
}

/** Large screens: inline links in the site header. */
export function TopNav() {
  return withPathname((pathname) => (
    <nav className="hidden lg:block" aria-label="Main">
      <ul className="flex items-center gap-1">
        {TABS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
                  active ? "bg-navy text-cream" : "text-navy/75 hover:bg-navy/5 hover:text-navy"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  ));
}
