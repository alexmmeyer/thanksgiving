"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CalendarIcon, DishIcon, HomeIcon, MapIcon } from "./icons";
import { WaveDivider } from "./WaveDivider";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/schedule", label: "Schedule", Icon: CalendarIcon },
  { href: "/where", label: "Where", Icon: MapIcon },
  { href: "/food", label: "Food", Icon: DishIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/schedule") return pathname.startsWith("/schedule") || pathname.startsWith("/rsvp");
  return pathname.startsWith(href);
}

function ActiveBottomNav() {
  return <NavBar pathname={usePathname()} />;
}

export function BottomNav() {
  return (
    <Suspense fallback={<NavBar pathname={null} />}>
      <ActiveBottomNav />
    </Suspense>
  );
}

function NavBar({ pathname }: { pathname: string | null }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30" aria-label="Main">
      <WaveDivider className="block h-4 w-full" />
      <ul className="grid grid-cols-4 bg-navy pb-[env(safe-area-inset-bottom)] text-cream">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname !== null && isActive(pathname, href);
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
  );
}
