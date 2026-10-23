import { connection, NextResponse, type NextRequest } from "next/server";
import { isPlanner } from "@/lib/auth";
import { geocode, GeocodeError } from "@/lib/geocode";
import { jsonError, plannersOnly, readBody } from "@/lib/http";
import { KEYS, listRecords, newId, putRecord } from "@/lib/redis";
import { placeInput, type Place } from "@/lib/types";

export async function GET() {
  await connection();
  const places = await listRecords<Place>(KEYS.places);
  places.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(places);
}

export async function POST(req: NextRequest) {
  if (!isPlanner(req)) return plannersOnly();
  const parsed = await readBody(req, placeInput);
  if (!parsed.ok) return parsed.response;

  try {
    const coords = await geocode(parsed.data.address);
    const place: Place = { ...parsed.data, ...coords, id: newId() };
    return NextResponse.json(await putRecord(KEYS.places, place), { status: 201 });
  } catch (err) {
    if (err instanceof GeocodeError) return jsonError(err.message, 422);
    throw err;
  }
}
