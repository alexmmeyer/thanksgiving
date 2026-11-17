"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/CategoryTabs";
import { DishForm } from "@/components/DishForm";
import { PlusIcon } from "@/components/icons";
import { EmptyState, ItemTile } from "@/components/ItemTile";
import { MealTabs } from "@/components/MealTabs";
import { Modal } from "@/components/Modal";
import { usePlanner } from "@/components/Providers";
import { inferDishDay } from "@/lib/dishes";
import { useDishes } from "@/lib/hooks";
import {
  CATEGORY_NAMES,
  DISH_CATEGORIES,
  DISH_DAY_DETAILS,
  type DishCategory,
  type DishDay,
  type PublicDish,
} from "@/lib/types";

type Editing = { mode: "new" } | { mode: "edit"; dish: PublicDish } | null;

export default function FoodPage() {
  const { planner } = usePlanner();
  const { data: dishes = [], error, isLoading } = useDishes();
  const [day, setDay] = useState<DishDay>("thursday");
  const [category, setCategory] = useState<DishCategory>("app");
  const [editing, setEditing] = useState<Editing>(null);

  const dayDishes = dishes.filter((dish) => inferDishDay(dish) === day);
  const counts = Object.fromEntries(
    DISH_CATEGORIES.map((c) => [c, dayDishes.filter((d) => d.category === c).length]),
  ) as Record<DishCategory, number>;
  const shown = dayDishes.filter((d) => d.category === category);
  const detail = DISH_DAY_DETAILS[day];

  function selectDay(next: DishDay) {
    setDay(next);
    setCategory((current) => {
      const onNight = dishes.filter((dish) => inferDishDay(dish) === next);
      if (onNight.some((dish) => dish.category === current)) return current;
      return DISH_CATEGORIES.find((c) => onNight.some((dish) => dish.category === c)) ?? "app";
    });
  }

  return (
    <>
      <MealTabs active={day} onChange={selectDay} />

      <div
        id="meal-panel"
        role="tabpanel"
        aria-labelledby={`meal-tab-${day}`}
        className="relative z-0 -mt-0.5 rounded-b-xl rounded-tr-xl border-2 border-navy/35 bg-cream px-3 pt-4 pb-4 sm:px-4"
      >
        <h1 className="font-serif text-3xl font-bold">{detail.title}</h1>
        <p className="mt-1 mb-1 text-navy/80">{detail.blurb}</p>

        <CategoryTabs active={category} counts={counts} onChange={setCategory} />

        {isLoading && <p className="mt-4 text-navy/70">Loading the menu...</p>}
        {error && (
          <p className="mt-4 text-coral">Couldn&apos;t load the menu. Please refresh the page.</p>
        )}

        <div role="tabpanel" className="mt-3 grid gap-3 sm:grid-cols-2">
          {!isLoading && shown.length === 0 && (
            <div className="sm:col-span-2">
              <EmptyState>No {CATEGORY_NAMES[category].toLowerCase()} yet. Be the first!</EmptyState>
            </div>
          )}
          {shown.map((dish) => (
            <ItemTile
              key={dish.id}
              className="bg-white"
              onEdit={dish.mine || planner ? () => setEditing({ mode: "edit", dish }) : undefined}
            >
              <h2 className="pr-20 font-serif text-lg font-bold leading-snug">{dish.name}</h2>
              <p className="mt-0.5 text-navy/75">
                {dish.bringer}
                {dish.mine && <span className="text-navy/55"> · you</span>}
              </p>
              {dish.labels.length > 0 && (
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {dish.labels.map((label) => (
                    <li
                      key={label}
                      className={`rounded-full px-2.5 py-0.5 text-sm font-semibold capitalize ${
                        label === "vegan" || label === "vegetarian"
                          ? "bg-palm/20 text-[#4f6943]"
                          : "bg-aqua/45 text-turquoise-deep"
                      }`}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </ItemTile>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[5.6rem] z-20 mx-auto flex max-w-2xl justify-end px-4 lg:bottom-8">
        <button
          type="button"
          className="btn btn-accent pointer-events-auto shadow-lg"
          onClick={() => setEditing({ mode: "new" })}
        >
          <PlusIcon /> Add a dish
        </button>
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === "edit" ? "Edit dish" : "Add a dish"}
      >
        {editing && (
          <DishForm
            key={editing.mode === "edit" ? editing.dish.id : `new-${day}`}
            dish={editing.mode === "edit" ? editing.dish : undefined}
            defaultCategory={category}
            defaultDay={day}
            onDone={(saved) => {
              if (saved) {
                setDay(saved.day);
                setCategory(saved.category);
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
