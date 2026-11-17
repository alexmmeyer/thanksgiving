"use client";

import { DISH_DAY_DETAILS, DISH_DAYS, type DishDay } from "@/lib/types";

export function MealTabs({
  active,
  onChange,
}: {
  active: DishDay;
  onChange: (day: DishDay) => void;
}) {
  return (
    <div role="tablist" aria-label="Which night" className="relative z-10 flex items-end gap-1.5">
      {DISH_DAYS.map((day) => {
        const selected = day === active;
        const detail = DISH_DAY_DETAILS[day];
        return (
          <button
            key={day}
            id={`meal-tab-${day}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls="meal-panel"
            onClick={() => onChange(day)}
            className={`relative max-w-[14rem] min-w-[8.75rem] flex-1 rounded-t-xl border-t-2 border-x-2 px-3.5 text-left sm:flex-none sm:px-5 ${
              selected
                ? "z-10 border-navy/35 bg-cream pt-3 pb-2.5"
                : "border-navy/20 bg-sand-deep pt-2 pb-1.5 text-navy/60"
            }`}
          >
            <span className="block truncate font-serif text-xl font-bold leading-tight">{detail.tab}</span>
            <span
              className={`mt-0.5 block truncate text-sm font-semibold ${
                selected ? "text-turquoise-deep" : "text-navy/45"
              }`}
            >
              {detail.note}
            </span>
            {selected && (
              <span aria-hidden className="absolute inset-x-0 -bottom-1 z-10 h-2 bg-cream" />
            )}
          </button>
        );
      })}
    </div>
  );
}
