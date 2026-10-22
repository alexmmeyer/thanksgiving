import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
  .nullable()
  .optional()
  .transform((v) => v || null);

export const groupInput = z.object({
  name: z.string().trim().min(1, "Group name is required").max(120),
  detail: z.string().trim().max(2000).default(""),
  address: z.string().trim().min(1, "Address is required").max(300),
  arrival: dateString,
  departure: dateString,
  isMainHouse: z.boolean().default(false),
});

/** "5-ish PM" -> "17:00", "12:00 PM onward" -> "12:00", "Time TBD" -> null. */
export function deriveSortTime(label: string): string | null {
  const match = label.match(/(\d{1,2})(?::(\d{2}))?\s*(?:-?ish)?\s*(am|pm)/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toLowerCase() === "pm") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2] ?? "00"}`;
}

const eventFields = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a day"),
  timeLabel: z.string().trim().min(1, "Time is required").max(40),
  sortTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional()
    .transform((v) => v || null),
  title: z.string().trim().min(1, "Title is required").max(140),
  location: z.string().trim().max(200).default(""),
  groupId: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v || null),
  details: z.string().trim().max(2000).default(""),
  requiresRsvp: z.boolean().default(false),
});

export const eventInput = eventFields.transform((e) => ({
  ...e,
  sortTime: e.sortTime ?? deriveSortTime(e.timeLabel),
}));

export const DISH_CATEGORIES = ["app", "salad", "main", "dessert", "other"] as const;
export const DISH_LABELS = ["gluten-free", "dairy-free", "vegan", "vegetarian", "paleo"] as const;

export const CATEGORY_NAMES: Record<DishCategory, string> = {
  app: "Apps",
  salad: "Salads",
  main: "Mains",
  dessert: "Desserts",
  other: "Other",
};

export const dishInput = z.object({
  name: z.string().trim().min(1, "Dish name is required").max(120),
  bringer: z.string().trim().min(1, "Tell us who's bringing it").max(120),
  category: z.enum(DISH_CATEGORIES),
  labels: z.array(z.enum(DISH_LABELS)).default([]),
});

export const RSVP_RESPONSES = ["yes", "maybe", "no"] as const;

export const rsvpInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  count: z.coerce.number().int().min(1).max(50),
  response: z.enum(RSVP_RESPONSES),
});

export type GroupInput = z.infer<typeof groupInput>;
export type EventInput = z.infer<typeof eventInput>;
export type DishInput = z.infer<typeof dishInput>;
export type RsvpInput = z.infer<typeof rsvpInput>;
export type DishCategory = (typeof DISH_CATEGORIES)[number];
export type DishLabel = (typeof DISH_LABELS)[number];
export type RsvpResponse = (typeof RSVP_RESPONSES)[number];

export type Group = GroupInput & { id: string; lat: number; lng: number };
export type EventItem = EventInput & { id: string };
export type Dish = DishInput & { id: string; createdAt: number; ownerId: string };
export type Rsvp = RsvpInput & { id: string; createdAt: number; ownerId: string };

/** By day, then by time; events with no set time ("Time TBD") lead their day. */
export function compareEvents(a: EventItem, b: EventItem) {
  return (
    a.date.localeCompare(b.date) || (a.sortTime ?? "").localeCompare(b.sortTime ?? "")
  );
}

/** Formats a YYYY-MM-DD string without letting time zones shift the day. */
export function formatDate(value: string | null | undefined, style: "long" | "short" = "short") {
  if (!value) return "TBD";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}

/** Shape sent to the browser: owner ids are replaced by a `mine` flag. */
export type Owned<T extends { ownerId: string }> = Omit<T, "ownerId"> & { mine: boolean };
export type PublicDish = Owned<Dish>;
export type PublicRsvp = Owned<Rsvp>;
