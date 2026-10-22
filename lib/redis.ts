import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";

type Hash = Record<string, unknown>;

interface Store {
  all(key: string): Promise<Hash>;
  get(key: string, id: string): Promise<unknown>;
  set(key: string, id: string, value: unknown): Promise<void>;
  del(key: string, id: string): Promise<void>;
  drop(key: string): Promise<void>;
}

function redisStore(url: string, token: string): Store {
  const redis = new Redis({ url, token });
  return {
    async all(key) {
      return (await redis.hgetall<Hash>(key)) ?? {};
    },
    async get(key, id) {
      return (await redis.hget(key, id)) ?? null;
    },
    async set(key, id, value) {
      await redis.hset(key, { [id]: value });
    },
    async del(key, id) {
      await redis.hdel(key, id);
    },
    async drop(key) {
      await redis.del(key);
    },
  };
}

/** Local development fallback when no Redis credentials are configured. */
function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", "dev-store.json");
  let cache: Record<string, Hash> | null = null;

  async function load() {
    if (cache) return cache;
    try {
      cache = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      cache = {};
    }
    return cache!;
  }
  async function save() {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(cache, null, 2));
  }

  return {
    async all(key) {
      return { ...((await load())[key] ?? {}) };
    },
    async get(key, id) {
      return (await load())[key]?.[id] ?? null;
    },
    async set(key, id, value) {
      const data = await load();
      data[key] = { ...(data[key] ?? {}), [id]: value };
      await save();
    },
    async del(key, id) {
      const data = await load();
      if (data[key]) delete data[key][id];
      await save();
    },
    async drop(key) {
      const data = await load();
      delete data[key];
      await save();
    },
  };
}

function createStore(): Store {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return redisStore(url, token);
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error("Redis is not configured. Add the Upstash Redis integration in Vercel.");
  }
  return fileStore();
}

let store: Store | null = null;
function db() {
  store ??= createStore();
  return store;
}

export const KEYS = {
  groups: "groups",
  events: "events",
  dishes: "dishes",
  rsvps: (eventId: string) => `rsvps:${eventId}`,
} as const;

export async function listRecords<T>(key: string): Promise<T[]> {
  return Object.values(await db().all(key)) as T[];
}

export async function getRecord<T>(key: string, id: string): Promise<T | null> {
  return (await db().get(key, id)) as T | null;
}

export async function putRecord<T extends { id: string }>(key: string, record: T) {
  await db().set(key, record.id, record);
  return record;
}

export async function deleteRecord(key: string, id: string) {
  await db().del(key, id);
}

export async function dropCollection(key: string) {
  await db().drop(key);
}

export function newId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
