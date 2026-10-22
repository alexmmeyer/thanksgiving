import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export const forbidden = () => jsonError("You don't have permission to do that.", 403);
export const plannersOnly = () => jsonError("Only planners can do that.", 403);
export const notFound = () => jsonError("That item no longer exists.", 404);

type Parsed<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

export async function readBody<S extends z.ZodType>(
  req: NextRequest,
  schema: S,
): Promise<Parsed<z.infer<S>>> {
  const body = await req.json().catch(() => null);
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Please check the form and try again.";
    return { ok: false, response: jsonError(message, 400) };
  }
  return { ok: true, data: result.data };
}
