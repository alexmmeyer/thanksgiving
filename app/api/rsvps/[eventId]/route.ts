import { NextResponse, type NextRequest } from "next/server";
import { deviceId, toPublic } from "@/lib/auth";
import { jsonError, notFound, readBody } from "@/lib/http";
import { getRecord, KEYS, listRecords, newId, putRecord } from "@/lib/redis";
import { rsvpInput, type EventItem, type Rsvp } from "@/lib/types";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/rsvps/[eventId]">) {
  const { eventId } = await ctx.params;
  const rsvps = await listRecords<Rsvp>(KEYS.rsvps(eventId));
  rsvps.sort((a, b) => a.createdAt - b.createdAt);
  return NextResponse.json(rsvps.map((r) => toPublic(req, r)));
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/rsvps/[eventId]">) {
  const { eventId } = await ctx.params;
  const event = await getRecord<EventItem>(KEYS.events, eventId);
  if (!event) return notFound();
  if (!event.requiresRsvp) return jsonError("This event isn't taking RSVPs.", 400);

  const owner = deviceId(req);
  if (!owner) return jsonError("Please turn on cookies for this site and try again.", 400);
  const parsed = await readBody(req, rsvpInput);
  if (!parsed.ok) return parsed.response;

  const rsvp: Rsvp = { ...parsed.data, id: newId(), createdAt: Date.now(), ownerId: owner };
  await putRecord(KEYS.rsvps(eventId), rsvp);
  return NextResponse.json(toPublic(req, rsvp), { status: 201 });
}
