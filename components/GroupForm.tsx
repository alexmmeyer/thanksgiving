"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { api } from "@/lib/client";
import { KEYS, upsert, without } from "@/lib/hooks";
import type { Group } from "@/lib/types";
import { FormActions, useSubmit } from "./FormActions";

export function GroupForm({
  group,
  onSaved,
  onDeleted,
}: {
  group?: Group;
  onSaved: (group: Group) => void;
  onDeleted: () => void;
}) {
  const { mutate } = useSWRConfig();
  const { busy, error, run } = useSubmit();
  const [form, setForm] = useState({
    name: group?.name ?? "",
    detail: group?.detail ?? "",
    address: group?.address ?? "",
    arrival: group?.arrival ?? "",
    departure: group?.departure ?? "",
    isMainHouse: group?.isMainHouse ?? false,
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function save(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      const body = { ...form, arrival: form.arrival || null, departure: form.departure || null };
      const saved = group
        ? await api<Group>(`/api/groups/${group.id}`, "PATCH", body)
        : await api<Group>("/api/groups", "POST", body);
      await mutate<Group[]>(KEYS.groups, (list) => upsert(list, saved));
      onSaved(saved);
    });
  }

  function remove() {
    if (!group) return;
    run(async () => {
      await api(`/api/groups/${group.id}`, "DELETE");
      await mutate<Group[]>(KEYS.groups, (list) => without(list, group.id), {
        revalidate: false,
      });
      onDeleted();
    });
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="grp-name">
          Group name
        </label>
        <input
          id="grp-name"
          className="field"
          placeholder="e.g. The Hudson Sandefurs"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="grp-detail">
          Who&apos;s staying here
        </label>
        <textarea
          id="grp-detail"
          className="field min-h-28"
          placeholder="Names, partners, kids..."
          value={form.detail}
          onChange={(e) => set("detail", e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="grp-address">
          Address
        </label>
        <textarea
          id="grp-address"
          className="field min-h-20"
          placeholder={"119 Sea Grass Circle\nCape San Blas, FL 32456"}
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="grp-arrival">
            Arrival
          </label>
          <input
            id="grp-arrival"
            type="date"
            className="field"
            value={form.arrival}
            onChange={(e) => set("arrival", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="grp-departure">
            Departure
          </label>
          <input
            id="grp-departure"
            type="date"
            className="field"
            min={form.arrival || undefined}
            value={form.departure}
            onChange={(e) => set("departure", e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-navy/20 bg-white px-4 py-3">
        <input
          type="checkbox"
          className="size-6 accent-gold"
          checked={form.isMainHouse}
          onChange={(e) => set("isMainHouse", e.target.checked)}
        />
        <span className="font-semibold">This is the Main House</span>
      </label>

      <FormActions
        busy={busy}
        error={error}
        submitLabel={group ? "Save changes" : "Add group"}
        onDelete={group ? remove : undefined}
        deleteLabel="Delete group"
      />
    </form>
  );
}
