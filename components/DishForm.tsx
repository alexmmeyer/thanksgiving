"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { api } from "@/lib/client";
import { KEYS, upsert, without } from "@/lib/hooks";
import { rememberedName, rememberName } from "@/lib/remember";
import {
  CATEGORY_NAMES,
  DISH_CATEGORIES,
  DISH_LABELS,
  type DishCategory,
  type DishLabel,
  type PublicDish,
} from "@/lib/types";
import { DeviceNote } from "./DeviceNote";
import { FormActions, useSubmit } from "./FormActions";

export function DishForm({
  dish,
  defaultCategory,
  onDone,
}: {
  dish?: PublicDish;
  defaultCategory: DishCategory;
  onDone: (saved?: PublicDish) => void;
}) {
  const { mutate } = useSWRConfig();
  const { busy, error, run } = useSubmit();
  const [name, setName] = useState(dish?.name ?? "");
  const [bringer, setBringer] = useState(() => dish?.bringer ?? rememberedName());
  const [category, setCategory] = useState<DishCategory>(dish?.category ?? defaultCategory);
  const [labels, setLabels] = useState<DishLabel[]>(dish?.labels ?? []);

  function toggleLabel(label: DishLabel) {
    setLabels((current) =>
      current.includes(label) ? current.filter((l) => l !== label) : [...current, label],
    );
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      const body = { name, bringer, category, labels };
      const saved = dish
        ? await api<PublicDish>(`/api/dishes/${dish.id}`, "PATCH", body)
        : await api<PublicDish>("/api/dishes", "POST", body);
      if (!dish) rememberName(bringer);
      await mutate<PublicDish[]>(KEYS.dishes, (list) => upsert(list, saved), {
        revalidate: false,
      });
      onDone(saved);
    });
  }

  function remove() {
    if (!dish) return;
    run(async () => {
      await api(`/api/dishes/${dish.id}`, "DELETE");
      await mutate<PublicDish[]>(KEYS.dishes, (list) => without(list, dish.id), {
        revalidate: false,
      });
      onDone();
    });
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className="field-label" htmlFor="dish-name">
          Dish name
        </label>
        <input
          id="dish-name"
          className="field"
          placeholder="e.g. Grandma's sweet potato casserole"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="dish-bringer">
          Who&apos;s bringing it?
        </label>
        <input
          id="dish-bringer"
          className="field"
          placeholder="Your name or family"
          value={bringer}
          onChange={(e) => setBringer(e.target.value)}
          required
        />
      </div>

      <fieldset>
        <legend className="field-label">Category</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DISH_CATEGORIES.map((c) => (
            <label
              key={c}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 ${
                category === c ? "border-navy bg-navy text-cream" : "border-navy/20 bg-white"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c}
                checked={category === c}
                onChange={() => setCategory(c)}
                className="size-5 accent-turquoise"
              />
              {CATEGORY_NAMES[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">
          Labels <span className="font-normal text-navy/60">(check any that apply)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {DISH_LABELS.map((label) => {
            const on = labels.includes(label);
            return (
              <label
                key={label}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 capitalize ${
                  on ? "border-turquoise-deep bg-turquoise-deep text-white" : "border-navy/20 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleLabel(label)}
                  className="sr-only"
                />
                {on && "✓ "}
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <DeviceNote />

      <FormActions
        busy={busy}
        error={error}
        submitLabel={dish ? "Save changes" : "Add dish"}
        onDelete={dish ? remove : undefined}
        deleteLabel="Delete dish"
      />
    </form>
  );
}
