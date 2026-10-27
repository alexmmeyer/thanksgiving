import type { Place } from "@/lib/types";
import { PinName } from "./StarPin";

export function PlacePin({ place, selected }: { place: Place; selected: boolean }) {
  return (
    <div className="flex flex-col items-center" style={{ filter: "drop-shadow(0 2px 3px rgb(30 42 74 / 0.35))" }}>
      <div
        className={`w-max max-w-44 rounded-md border border-turquoise-deep/60 bg-cream px-2.5 py-1 text-center font-serif text-[13px] leading-tight font-bold text-navy [overflow-wrap:anywhere] ${
          selected ? "ring-2 ring-turquoise ring-offset-1" : ""
        }`}
      >
        <PinName name={place.name} />
      </div>
      <svg width={24} height={28} viewBox="0 0 24 28" aria-hidden className="-mt-0.5 text-turquoise-deep">
        <path
          fill="currentColor"
          d="M12 27s-9-8.4-9-15a9 9 0 0 1 18 0c0 6.6-9 15-9 15Z"
        />
        <circle cx="12" cy="12" r="3.4" fill="white" />
      </svg>
    </div>
  );
}
