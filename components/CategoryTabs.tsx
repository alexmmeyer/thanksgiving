"use client";

import { CATEGORY_NAMES, DISH_CATEGORIES, type DishCategory } from "@/lib/types";

export function CategoryTabs({
  active,
  counts,
  onChange,
}: {
  active: DishCategory;
  counts: Record<DishCategory, number>;
  onChange: (category: DishCategory) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Dish categories"
      className="sticky top-[3.2rem] z-10 -mx-4 flex gap-2 overflow-x-auto bg-sand/95 px-4 py-3 backdrop-blur [scrollbar-width:none]"
    >
      {DISH_CATEGORIES.map((c) => {
        const selected = c === active;
        return (
          <button
            key={c}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(c)}
            className={`min-h-11 shrink-0 rounded-full border-2 px-4 font-semibold whitespace-nowrap ${
              selected
                ? "border-navy bg-navy text-cream"
                : "border-navy/25 bg-cream text-navy"
            }`}
          >
            {CATEGORY_NAMES[c]} ({counts[c]})
          </button>
        );
      })}
    </div>
  );
}
