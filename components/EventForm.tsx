"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { api } from "@/lib/client";
import { KEYS, upsert, without } from "@/lib/hooks";
import { compareEvents, type EventItem, type Group } from "@/lib/types";
import { FormActions, useSubmit } from "./FormActions";

export const REUNION_DAYS = ["2026-11-25", "2026-11-26", "2026-11-27"];

export function EventForm({
  event,
  groups,
  onDone,
}: {
  event?: EventItem;
  groups: Group[];
  onDone: () => void;
}) {
  const { mutate } = useSWRConfig();
  const { busy, error, run } = useSubmit();
  const [form, setForm] = useState({
    date: event?.date ?? REUNION_DAYS[1],
    timeLabel: event?.timeLabel ?? "",
    title: event?.title ?? "",
    location: event?.location ?? "",
    groupId: event?.groupId ?? "",
    details: event?.details ?? "",
    requiresRsvp: event?.requiresRsvp ?? false,
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const days = REUNION_DAYS.includes(form.date) ? REUNION_DAYS : [...REUNION_DAYS, form.date];

  function save(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      const body = { ...form, groupId: form.groupId || null };
      const saved = event
        ? await api<EventItem>(`/api/events/${event.id}`, "PATCH", body)
        : await api<EventItem>("/api/events", "POST", body);
      await mutate<EventItem[]>(KEYS.events, (list) => upsert(list, saved).sort(compareEvents), {
        revalidate: false,
      });
      await mutate(KEYS.rsvpCounts);
      onDone();
    });
  }

  function remove() {
    if (!event) return;
    run(async () => {
      await api(`/api/events/${event.id}`, "DELETE");
      await mutate<EventItem[]>(KEYS.events, (list) => without(list, event.id), {
        revalidate: false,
      });
      onDone();
    });
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="ev-title">
          Event name
        </label>
        <input
          id="ev-title"
          className="field"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="ev-date">
            Day
          </label>
          <select
            id="ev-date"
            className="field"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="ev-time">
            Time
          </label>
          <input
            id="ev-time"
            className="field"
            placeholder="5:30 PM or Time TBD"
            value={form.timeLabel}
            onChange={(e) => set("timeLabel", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="ev-location">
          Location
        </label>
        <input
          id="ev-location"
          className="field"
          placeholder="Main House, the beach, TBD..."
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="ev-group">
          Link to a house on the map <span className="font-normal text-navy/60">(optional)</span>
        </label>
        <select
          id="ev-group"
          className="field"
          value={form.groupId}
          onChange={(e) => set("groupId", e.target.value)}
        >
          <option value="">No link</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
              {g.isMainHouse ? " (Main House)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="ev-details">
          Details <span className="font-normal text-navy/60">(optional)</span>
        </label>
        <textarea
          id="ev-details"
          className="field min-h-24"
          value={form.details}
          onChange={(e) => set("details", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-navy/20 bg-white px-4 py-3">
        <input
          type="checkbox"
          className="size-6 accent-turquoise-deep"
          checked={form.requiresRsvp}
          onChange={(e) => set("requiresRsvp", e.target.checked)}
        />
        <span>
          <span className="block font-semibold">Requires RSVP</span>
          <span className="text-sm text-navy/70">Shows an RSVP button on this event.</span>
        </span>
      </label>

      <FormActions
        busy={busy}
        error={error}
        submitLabel={event ? "Save changes" : "Add event"}
        onDelete={event ? remove : undefined}
        deleteLabel="Delete event"
      />
    </form>
  );
}
