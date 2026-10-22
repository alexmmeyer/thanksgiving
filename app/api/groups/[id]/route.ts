import { NextResponse, type NextRequest } from "next/server";
import { isPlanner } from "@/lib/auth";
import { geocode, GeocodeError } from "@/lib/geocode";
import { jsonError, notFound, plannersOnly, readBody } from "@/lib/http";
import { deleteRecord, getRecord, KEYS, putRecord } from "@/lib/redis";
import { groupInput, type Group } from "@/lib/types";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/groups/[id]">) {
  if (!isPlanner(req)) return plannersOnly();
  const { id } = await ctx.params;
  const existing = await getRecord<Group>(KEYS.groups, id);
  if (!existing) return notFound();

  const parsed = await readBody(req, groupInput);
  if (!parsed.ok) return parsed.response;

  try {
    const coords =
      parsed.data.address === existing.address
        ? { lat: existing.lat, lng: existing.lng }
        : await geocode(parsed.data.address);
    const group: Group = { ...parsed.data, ...coords, id };
    return NextResponse.json(await putRecord(KEYS.groups, group));
  } catch (err) {
    if (err instanceof GeocodeError) return jsonError(err.message, 422);
    throw err;
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/groups/[id]">) {
  if (!isPlanner(req)) return plannersOnly();
  const { id } = await ctx.params;
  await deleteRecord(KEYS.groups, id);
  return NextResponse.json({ ok: true });
}
