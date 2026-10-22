import { connection, NextResponse, type NextRequest } from "next/server";
import { isPlanner } from "@/lib/auth";
import { geocode, GeocodeError } from "@/lib/geocode";
import { jsonError, plannersOnly, readBody } from "@/lib/http";
import { KEYS, listRecords, newId, putRecord } from "@/lib/redis";
import { groupInput, type Group } from "@/lib/types";

export async function GET() {
  await connection();
  const groups = await listRecords<Group>(KEYS.groups);
  groups.sort(
    (a, b) => Number(b.isMainHouse) - Number(a.isMainHouse) || a.name.localeCompare(b.name),
  );
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  if (!isPlanner(req)) return plannersOnly();
  const parsed = await readBody(req, groupInput);
  if (!parsed.ok) return parsed.response;

  try {
    const coords = await geocode(parsed.data.address);
    const group: Group = { ...parsed.data, ...coords, id: newId() };
    return NextResponse.json(await putRecord(KEYS.groups, group), { status: 201 });
  } catch (err) {
    if (err instanceof GeocodeError) return jsonError(err.message, 422);
    throw err;
  }
}
