import { NextResponse, type NextRequest } from "next/server";
import { canEdit, toPublic } from "@/lib/auth";
import { forbidden, notFound, readBody } from "@/lib/http";
import { deleteRecord, getRecord, KEYS, putRecord } from "@/lib/redis";
import { rsvpInput, type Rsvp } from "@/lib/types";

type Ctx = RouteContext<"/api/rsvps/[eventId]/[id]">;

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { eventId, id } = await ctx.params;
  const key = KEYS.rsvps(eventId);
  const existing = await getRecord<Rsvp>(key, id);
  if (!existing) return notFound();
  if (!canEdit(req, existing)) return forbidden();

  const parsed = await readBody(req, rsvpInput);
  if (!parsed.ok) return parsed.response;
  const rsvp: Rsvp = { ...existing, ...parsed.data };
  await putRecord(key, rsvp);
  return NextResponse.json(toPublic(req, rsvp));
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { eventId, id } = await ctx.params;
  const key = KEYS.rsvps(eventId);
  const existing = await getRecord<Rsvp>(key, id);
  if (!existing) return NextResponse.json({ ok: true });
  if (!canEdit(req, existing)) return forbidden();
  await deleteRecord(key, id);
  return NextResponse.json({ ok: true });
}
