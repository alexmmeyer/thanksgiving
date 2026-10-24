/**
 * Makes a deployed site's schedule match EVENTS in scripts/seed-data.ts.
 * Events are matched by day and title (a title that starts with the other one
 * counts, so "Low Country Boil" matches "Low Country Boil & fresh tunes...").
 * Matched events are edited in place, so their RSVPs are kept. Missing events
 * are added. Events on the site that aren't in the file are left alone.
 *
 *   SITE_URL=... PLANNER_PASSWORD=... npm run sync-schedule            preview changes
 *   SITE_URL=... PLANNER_PASSWORD=... npm run sync-schedule -- --apply make them
 */
import { formatDate, formatTime, type EventInput, type EventItem, type Group } from "../lib/types";
import { EVENTS } from "./seed-data";
import { plannerSession, runScript } from "./site";

const apply = process.argv.includes("--apply");
const FIELDS = ["date", "time", "title", "location", "groupId", "details", "requiresRsvp"] as const;

const normalize = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function sameEvent(live: EventItem, wanted: EventInput) {
  if (live.date !== wanted.date) return false;
  const a = normalize(live.title);
  const b = normalize(wanted.title);
  return a.startsWith(b) || b.startsWith(a);
}

function show(field: (typeof FIELDS)[number], value: unknown, groups: Group[]) {
  if (field === "time") return formatTime(value as string | null);
  if (field === "date") return formatDate(value as string);
  if (field === "groupId") return groups.find((g) => g.id === value)?.name ?? "(no house)";
  if (value === "" || value === undefined || value === null) return "(empty)";
  return JSON.stringify(value);
}

runScript(async () => {
  const { api } = await plannerSession();
  const [live, groups] = await Promise.all([
    api<EventItem[]>("/api/events"),
    api<Group[]>("/api/groups"),
  ]);
  const mainHouse = groups.find((g) => g.isMainHouse);
  const unmatched = new Set(live);
  let changes = 0;

  for (const { atMainHouse, ...seed } of EVENTS) {
    const wanted: EventInput = { ...seed, groupId: atMainHouse ? (mainHouse?.id ?? null) : null };
    const match = [...unmatched].find((e) => sameEvent(e, wanted));
    const label = `${formatDate(wanted.date)} ${formatTime(wanted.time)} · ${wanted.title}`;

    if (!match) {
      changes++;
      console.log(`+ add      ${label}`);
      if (apply) await api("/api/events", "POST", wanted);
      continue;
    }
    unmatched.delete(match);

    const diffs = FIELDS.filter((f) => (match[f] ?? null) !== (wanted[f] ?? null));
    if (diffs.length === 0) {
      console.log(`  same     ${label}`);
      continue;
    }
    changes++;
    console.log(`~ update   ${label}`);
    for (const f of diffs) {
      console.log(`      ${f}: ${show(f, match[f], groups)} -> ${show(f, wanted[f], groups)}`);
    }
    if (apply) await api(`/api/events/${match.id}`, "PATCH", wanted);
  }

  for (const e of unmatched) {
    console.log(`? not in file, left alone: ${formatDate(e.date)} · ${e.title} (delete it in the app if it's not happening)`);
  }

  if (changes === 0) console.log("\nThe schedule is already up to date.");
  else if (apply) console.log(`\nDone. ${changes} event(s) added or updated.`);
  else console.log(`\nPreview only. Run again with -- --apply to make these ${changes} change(s).`);
});
