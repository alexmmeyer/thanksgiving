import { NextResponse, type NextRequest } from "next/server";
import { canEdit, toPublic } from "@/lib/auth";
import { forbidden, notFound, readBody } from "@/lib/http";
import { deleteRecord, getRecord, KEYS, putRecord } from "@/lib/redis";
import { dishInput, type Dish } from "@/lib/types";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/dishes/[id]">) {
  const { id } = await ctx.params;
  const existing = await getRecord<Dish>(KEYS.dishes, id);
  if (!existing) return notFound();
  if (!canEdit(req, existing)) return forbidden();

  const parsed = await readBody(req, dishInput);
  if (!parsed.ok) return parsed.response;
  const dish: Dish = { ...existing, ...parsed.data };
  await putRecord(KEYS.dishes, dish);
  return NextResponse.json(toPublic(req, dish));
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/dishes/[id]">) {
  const { id } = await ctx.params;
  const existing = await getRecord<Dish>(KEYS.dishes, id);
  if (!existing) return NextResponse.json({ ok: true });
  if (!canEdit(req, existing)) return forbidden();
  await deleteRecord(KEYS.dishes, id);
  return NextResponse.json({ ok: true });
}
