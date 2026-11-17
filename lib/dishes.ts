import type { Dish, DishDay } from "./types";

/**
 * Dishes filed on the Thursday potluck before Wednesday had its own tab.
 * Matched by id so a rename doesn't send them back, and by name so anything
 * else that says "Wednesday" lands on that night until it has a stored day.
 */
const WEDNESDAY_DISH_IDS = new Set([
  "df67bfa85767", // Pot of chili for Wednesday night — Anita Sandefur
  "0e2c64b9db75", // Chili for Wednesday — Lauren Pressley
  "6729778a5644", // Veggie chili for Wednesday — Laurie
  "7193601114cd", // Cornbread for Wednesday — Sloan
  "e631523280f1", // Brunswick Stew for Wednesday night — Ed
  "d2f4824554e5", // Cornbread muffins for Wednesday night — Jean
]);

export function inferDishDay(dish: { id?: string; name?: string; day?: string | null }): DishDay {
  if (dish.day === "wednesday" || dish.day === "thursday") return dish.day;
  if (dish.id && WEDNESDAY_DISH_IDS.has(dish.id)) return "wednesday";
  if (dish.name && /\bwednesday\b/i.test(dish.name)) return "wednesday";
  return "thursday";
}

/** Fill in a night for dishes saved before the food page had two tabs. */
export function withDishDay(dish: Dish & { day?: DishDay }): Dish {
  const day = inferDishDay(dish);
  return dish.day === day ? dish : { ...dish, day };
}
