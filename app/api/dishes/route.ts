import { NextResponse, type NextRequest } from "next/server";
import { deviceId, toPublic } from "@/lib/auth";
import { jsonError, readBody } from "@/lib/http";
import { KEYS, listRecords, newId, putRecord } from "@/lib/redis";
import { inferDishDay, withDishDay } from "@/lib/dishes";
import { dishInput, type Dish } from "@/lib/types";

export async function GET(req: NextRequest) {
  const stored = await listRecords<Dish & { day?: Dish["day"]; description?: string }>(KEYS.dishes);
  const dishes = await Promise.all(
    stored.map(async (dish) => {
      const next = withDishDay(dish);
      if (next !== dish) await putRecord(KEYS.dishes, next);
      return next;
    }),
  );
  dishes.sort((a, b) => a.createdAt - b.createdAt);
  return NextResponse.json(dishes.map((d) => toPublic(req, d)));
}

export async function POST(req: NextRequest) {
  const owner = deviceId(req);
  if (!owner) return jsonError("Please turn on cookies for this site and try again.", 400);
  const parsed = await readBody(req, dishInput);
  if (!parsed.ok) return parsed.response;

  const dish: Dish = {
    ...parsed.data,
    description: parsed.data.description ?? "",
    day: parsed.data.day ?? inferDishDay({ name: parsed.data.name }),
    id: newId(),
    createdAt: Date.now(),
    ownerId: owner,
  };
  await putRecord(KEYS.dishes, dish);
  return NextResponse.json(toPublic(req, dish), { status: 201 });
}
