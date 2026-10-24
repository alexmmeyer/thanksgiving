/**
 * Adds the starter "things to do" to a deployed site through its API, so no
 * Redis or Google credentials are needed locally. Places whose name already
 * exists on the site are skipped, so it's safe to run again.
 *
 *   SITE_URL=https://your-site.vercel.app PLANNER_PASSWORD=... npm run add-places
 */
import type { Place } from "../lib/types";
import { PLACES } from "./seed-data";
import { plannerSession, runScript } from "./site";

runScript(async () => {
  const { api } = await plannerSession();
  const names = new Set((await api<Place[]>("/api/places")).map((p) => p.name));

  for (const place of PLACES) {
    if (names.has(place.name)) {
      console.log(`skipped ${place.name} (already there)`);
      continue;
    }
    try {
      const saved = await api<Place>("/api/places", "POST", place);
      console.log(`added ${saved.name} (${saved.lat.toFixed(5)}, ${saved.lng.toFixed(5)})`);
    } catch (err) {
      console.error(`failed ${place.name}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log("Done.");
});
