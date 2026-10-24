import Link from "next/link";
import { Compass } from "@/components/Compass";
import { CalendarIcon, ChevronRightIcon, MapIcon, TurkeyLegIcon } from "@/components/icons";
import { LockButton } from "@/components/LockButton";
import { WaveDivider } from "@/components/WaveDivider";

const TILES = [
  {
    href: "/schedule",
    title: "Schedule & RSVPs",
    blurb: "What's happening each day, and RSVP for the events that need a headcount.",
    Icon: CalendarIcon,
  },
  {
    href: "/places",
    title: "Places",
    blurb: "Where everyone's staying and things to do nearby, with directions from wherever you are.",
    Icon: MapIcon,
  },
  {
    href: "/food",
    title: "Thanksgiving Potluck",
    blurb: "See what's on the table and add the dish you're bringing.",
    Icon: TurkeyLegIcon,
  },
];

export default function Home() {
  return (
    <div className="-mt-5">
      <section className="relative -mx-4 overflow-hidden bg-gradient-to-b from-cream to-sand px-6 pt-16 pb-0 text-center">
        <Compass size={48} className="absolute top-4 right-4 text-navy/70" />
        <p className="caps text-[1.05rem] text-navy/75">The McAfee-Sandefur</p>
        <h1 className="mt-2 font-script text-[3.6rem] leading-[1.05] text-navy [-webkit-text-stroke:0.9px_currentColor]">
          Thanksgiving Reunion
        </h1>
        <div className="mx-auto mt-3 flex max-w-xs items-center gap-3 text-navy/80">
          <span className="h-px flex-1 bg-navy/40" />
          <span className="caps">2026</span>
          <span className="h-px flex-1 bg-navy/40" />
        </div>
        <p className="mt-4 font-serif text-lg">November 25-27</p>
        <p className="caps mt-1.5 text-[1.05rem] text-turquoise-deep">Cape San Blas · Florida</p>
        <WaveDivider className="mt-8 block h-12 w-[calc(100%+3rem)] -mx-6" />
      </section>

      <nav className="mt-6 space-y-4" aria-label="Sections">
        {TILES.map(({ href, title, blurb, Icon }) => (
          <Link key={href} href={href} className="label-card flex items-center gap-4 p-4 active:bg-white">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy text-cream">
              <Icon size={28} />
            </span>
            <span className="flex-1">
              <span className="block font-serif text-xl font-bold">{title}</span>
              <span className="mt-0.5 block text-navy/75">{blurb}</span>
            </span>
            <ChevronRightIcon className="shrink-0 text-navy/50" />
          </Link>
        ))}
      </nav>

      <footer className="mt-10 flex items-center justify-between text-sm text-navy/55">
        <span className="caps text-[0.7rem]">Gulf of Mexico · St. Joseph Bay</span>
        <LockButton />
      </footer>
    </div>
  );
}
