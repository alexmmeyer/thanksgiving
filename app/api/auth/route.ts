import { NextResponse, type NextRequest } from "next/server";
import { checkPassword, clearPlannerCookie, isPlanner, setPlannerCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  return NextResponse.json({ planner: isPlanner(req) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }
  const res = NextResponse.json({ planner: true });
  setPlannerCookie(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ planner: false });
  clearPlannerCookie(res);
  return res;
}
