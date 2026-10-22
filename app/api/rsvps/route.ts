import { connection, NextResponse } from "next/server";
import { KEYS, listRecords } from "@/lib/redis";
import type { EventItem, Rsvp } from "@/lib/types";

/** Headcount of "yes" replies for every event that takes RSVPs. */
export async function GET() {
  await connection();
  const events = await listRecords<EventItem>(KEYS.events);
  const entries = await Promise.all(
    events
      .filter((e) => e.requiresRsvp)
      .map(async (e) => {
        const rsvps = await listRecords<Rsvp>(KEYS.rsvps(e.id));
        const yes = rsvps.filter((r) => r.response === "yes").reduce((n, r) => n + r.count, 0);
        return [e.id, yes] as const;
      }),
  );
  return NextResponse.json(Object.fromEntries(entries));
}
