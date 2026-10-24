/** Talks to a deployed site's API as a planner, for scripts that update prod data. */
export async function plannerSession() {
  const site = process.env.SITE_URL?.replace(/\/$/, "");
  const password = process.env.PLANNER_PASSWORD;
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

  /** Throws with the API's error message on failure. */
  async function api<T>(path: string, method: "GET" | "POST" | "PATCH" = "GET", body?: unknown): Promise<T> {
    const res = await fetch(`${site}${path}`, {
      method,
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error ?? `${method} ${path} failed (${res.status})`);
    return data as T;
  }

  return { site, api };
}

export function runScript(main: () => Promise<void>) {
  main().catch((err) => {
    const cause = err instanceof Error && err.cause instanceof Error ? ` (${err.cause.message})` : "";
    console.error(err instanceof Error ? `${err.message}${cause}` : err);
    process.exit(1);
  });
}
