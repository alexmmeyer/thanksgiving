"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { api } from "@/lib/client";
import { KEYS, upsert, without } from "@/lib/hooks";
import type { Place } from "@/lib/types";
import { FormActions, useSubmit } from "./FormActions";

export function PlaceForm({
  place,
  onSaved,
  onDeleted,
}: {
  place?: Place;
  onSaved: (place: Place) => void;
  onDeleted: () => void;
}) {
  const { mutate } = useSWRConfig();
  const { busy, error, run } = useSubmit();
  const [form, setForm] = useState({
    name: place?.name ?? "",
    description: place?.description ?? "",
    address: place?.address ?? "",
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function save(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      const saved = place
        ? await api<Place>(`/api/places/${place.id}`, "PATCH", form)
        : await api<Place>("/api/places", "POST", form);
      await mutate<Place[]>(KEYS.places, (list) => upsert(list, saved));
      onSaved(saved);
    });
  }

  function remove() {
    if (!place) return;
    run(async () => {
      await api(`/api/places/${place.id}`, "DELETE");
      await mutate<Place[]>(KEYS.places, (list) => without(list, place.id), {
        revalidate: false,
      });
      onDeleted();
    });
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="place-name">
          Name
        </label>
        <input
          id="place-name"
          className="field"
          placeholder="e.g. Indian Pass Raw Bar"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="place-description">
          Description
        </label>
        <textarea
          id="place-description"
          className="field min-h-28"
          placeholder="What it is, why it's fun, phone number..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="place-address">
          Address
        </label>
        <textarea
          id="place-address"
          className="field min-h-20"
          placeholder={"8391 County Rd 30A\nPort St. Joe, FL 32456"}
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          required
        />
      </div>

      <FormActions
        busy={busy}
        error={error}
        submitLabel={place ? "Save changes" : "Add place"}
        onDelete={place ? remove : undefined}
        deleteLabel="Delete place"
      />
    </form>
  );
}
