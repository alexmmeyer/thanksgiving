/**
 * Adds the starter "things to do" to a deployed site through its API, so no
 * Redis or Google credentials are needed locally. Places whose name already
 * exists on the site are skipped, so it's safe to run again.
 *
 *   SITE_URL=https://your-site.vercel.app PLANNER_PASSWORD=... npm run add-places
 */
import type { Place } from "../lib/types";
import { PLACES } from "./seed-data";

const site = process.env.SITE_URL?.replace(/\/$/, "");
const password = process.env.PLANNER_PASSWORD;

async function main() {
  if (!site || !password) throw new Error("Set SITE_URL and PLANNER_PASSWORD.");

  const login = await fetch(`${site}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!login.ok) throw new Error(`Planner login failed (${login.status}). Check the password.`);
  const cookie = login.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");

  const existing = await fetch(`${site}/api/places`);
  if (!existing.ok) {
    throw new Error(`Couldn't load places (${existing.status}). Is the new code deployed yet?`);
  }
  const names = new Set(((await existing.json()) as Place[]).map((p) => p.name));

  for (const place of PLACES) {
    if (names.has(place.name)) {
      console.log(`skipped ${place.name} (already there)`);
      continue;
    }
    const res = await fetch(`${site}/api/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(place),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`failed ${place.name}: ${body?.error ?? res.status}`);
      continue;
    }
    const saved = body as Place;
    console.log(`added ${saved.name} (${saved.lat.toFixed(5)}, ${saved.lng.toFixed(5)})`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
