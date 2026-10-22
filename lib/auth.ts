import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { Owned } from "./types";

export const PLANNER_COOKIE = "planner";
export const DEVICE_COOKIE = "did";
const PLANNER_MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.VERCEL) throw new Error("SESSION_SECRET is not set");
  return "dev-only-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkPassword(password: string) {
  const expected = process.env.PLANNER_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

export function setPlannerCookie(res: NextResponse) {
  const expires = String(Date.now() + PLANNER_MAX_AGE * 1000);
  res.cookies.set(PLANNER_COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PLANNER_MAX_AGE,
  });
}

export function clearPlannerCookie(res: NextResponse) {
  res.cookies.delete(PLANNER_COOKIE);
}

export function isPlanner(req: NextRequest) {
  const value = req.cookies.get(PLANNER_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

export function deviceId(req: NextRequest) {
  return req.cookies.get(DEVICE_COOKIE)?.value ?? null;
}

export function canEdit(req: NextRequest, record: { ownerId: string }) {
  if (isPlanner(req)) return true;
  const id = deviceId(req);
  return id !== null && id === record.ownerId;
}

export function toPublic<T extends { ownerId: string }>(req: NextRequest, record: T): Owned<T> {
  const { ownerId, ...rest } = record;
  const id = deviceId(req);
  return { ...rest, mine: id !== null && id === ownerId };
}
