import { NextResponse, type NextRequest } from "next/server";
import { isPlanner } from "@/lib/auth";
import { notFound, plannersOnly, readBody } from "@/lib/http";
import { deleteRecord, dropCollection, getRecord, KEYS, putRecord } from "@/lib/redis";
import { eventInput, type EventItem } from "@/lib/types";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/events/[id]">) {
  const { id } = await ctx.params;
  const event = await getRecord<EventItem>(KEYS.events, id);
  return event ? NextResponse.json(event) : notFound();
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/events/[id]">) {
  if (!isPlanner(req)) return plannersOnly();
  const { id } = await ctx.params;
  if (!(await getRecord<EventItem>(KEYS.events, id))) return notFound();

  const parsed = await readBody(req, eventInput);
  if (!parsed.ok) return parsed.response;
  return NextResponse.json(await putRecord(KEYS.events, { ...parsed.data, id }));
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/events/[id]">) {
  if (!isPlanner(req)) return plannersOnly();
  const { id } = await ctx.params;
  await deleteRecord(KEYS.events, id);
  await dropCollection(KEYS.rsvps(id));
  return NextResponse.json({ ok: true });
}
