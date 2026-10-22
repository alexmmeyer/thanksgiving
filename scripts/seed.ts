/**
 * Loads the starter groups and schedule.
 *
 *   npm run seed            only fills collections that are empty
 *   npm run seed -- --force replaces groups and events (RSVPs for removed events are cleared)
 */
import { geocode } from "../lib/geocode";
import { dropCollection, KEYS, listRecords, newId, putRecord } from "../lib/redis";
import { eventInput, type EventItem, type Group } from "../lib/types";
import { EVENTS, GROUPS } from "./seed-data";

const force = process.argv.includes("--force");

async function seedGroups(): Promise<Group[]> {
  const existing = await listRecords<Group>(KEYS.groups);
  if (existing.length > 0 && !force) {
    console.log(`groups: ${existing.length} already exist, skipping`);
    return existing;
  }

  let located: Group[];
  try {
    located = [];
    for (const input of GROUPS) {
      located.push({ ...input, ...(await geocode(input.address)), id: newId() });
    }
  } catch (err) {
    console.error(`groups: skipped, ${err instanceof Error ? err.message : err}`);
    return existing;
  }

  await dropCollection(KEYS.groups);
  for (const group of located) {
    await putRecord(KEYS.groups, group);
    console.log(`groups: added ${group.name} (${group.lat.toFixed(5)}, ${group.lng.toFixed(5)})`);
  }
  return located;
}

async function seedEvents(groups: Group[]) {
  const existing = await listRecords<EventItem>(KEYS.events);
  if (existing.length > 0 && !force) {
    console.log(`events: ${existing.length} already exist, skipping`);
    await linkMainHouse(existing, groups);
    return;
  }
  for (const event of existing) await dropCollection(KEYS.rsvps(event.id));
  await dropCollection(KEYS.events);

  const mainHouse = groups.find((g) => g.isMainHouse);
  for (const { atMainHouse, ...seed } of EVENTS) {
    const data = eventInput.parse({ ...seed, groupId: atMainHouse ? mainHouse?.id : null });
    await putRecord(KEYS.events, { ...data, id: newId() });
    console.log(`events: added ${data.title}`);
  }
}

/** Covers groups being seeded after events (e.g. once a Google key is added). */
async function linkMainHouse(events: EventItem[], groups: Group[]) {
  const mainHouse = groups.find((g) => g.isMainHouse);
  if (!mainHouse) return;
  for (const event of events) {
    if (!event.groupId && event.location === "Main House") {
      await putRecord(KEYS.events, { ...event, groupId: mainHouse.id });
      console.log(`events: linked ${event.title} to the Main House`);
    }
  }
}

async function main() {
  const groups = await seedGroups();
  await seedEvents(groups);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
