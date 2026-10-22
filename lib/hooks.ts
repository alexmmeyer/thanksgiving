"use client";

import useSWR from "swr";
import type { EventItem, Group, PublicDish, PublicRsvp } from "./types";

export const KEYS = {
  groups: "/api/groups",
  events: "/api/events",
  dishes: "/api/dishes",
  rsvpCounts: "/api/rsvps",
  rsvps: (eventId: string) => `/api/rsvps/${eventId}`,
};

export const useGroups = () => useSWR<Group[]>(KEYS.groups);
export const useEvents = () => useSWR<EventItem[]>(KEYS.events);
export const useDishes = () => useSWR<PublicDish[]>(KEYS.dishes);
export const useRsvpCounts = () => useSWR<Record<string, number>>(KEYS.rsvpCounts);
export const useRsvps = (eventId: string) => useSWR<PublicRsvp[]>(KEYS.rsvps(eventId));

/** Replace-or-append by id, used for optimistic list updates. */
export function upsert<T extends { id: string }>(list: T[] | undefined, item: T): T[] {
  const items = list ?? [];
  return items.some((i) => i.id === item.id)
    ? items.map((i) => (i.id === item.id ? item : i))
    : [...items, item];
}

export function without<T extends { id: string }>(list: T[] | undefined, id: string): T[] {
  return (list ?? []).filter((i) => i.id !== id);
}
