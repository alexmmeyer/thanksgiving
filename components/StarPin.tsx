import type { Group } from "@/lib/types";
import { StarIcon } from "./icons";

export function StarPin({ group, selected }: { group: Group; selected: boolean }) {
  const main = group.isMainHouse;
  return (
    <div className="flex flex-col items-center" style={{ filter: "drop-shadow(0 2px 3px rgb(30 42 74 / 0.35))" }}>
      <div
        className={`max-w-44 rounded-md border px-2.5 py-1 text-center font-serif text-[13px] leading-tight font-bold ${
          main ? "border-gold bg-navy text-cream" : "border-navy/40 bg-cream text-navy"
        } ${selected ? "ring-2 ring-turquoise ring-offset-1" : ""}`}
      >
        {group.name}
        {main && <span className="block text-[10px] font-normal tracking-[0.15em] uppercase text-cream/85">Main House</span>}
      </div>
      <StarIcon size={main ? 30 : 26} className={`-mt-0.5 ${main ? "text-gold" : "text-navy"}`} />
    </div>
  );
}
