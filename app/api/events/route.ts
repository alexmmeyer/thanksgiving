import { connection, NextResponse, type NextRequest } from "next/server";
import { isPlanner } from "@/lib/auth";
import { plannersOnly, readBody } from "@/lib/http";
import { KEYS, listRecords, newId, putRecord } from "@/lib/redis";
import { compareEvents, eventInput, type EventItem } from "@/lib/types";

export async function GET() {
  await connection();
  const events = await listRecords<EventItem>(KEYS.events);
  return NextResponse.json(events.sort(compareEvents));
}

export async function POST(req: NextRequest) {
  if (!isPlanner(req)) return plannersOnly();
  const parsed = await readBody(req, eventInput);
  if (!parsed.ok) return parsed.response;
  const event: EventItem = { ...parsed.data, id: newId() };
  return NextResponse.json(await putRecord(KEYS.events, event), { status: 201 });
}
