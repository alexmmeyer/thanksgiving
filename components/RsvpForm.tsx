"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { api } from "@/lib/client";
import { KEYS, upsert, without } from "@/lib/hooks";
import { rememberedName, rememberName } from "@/lib/remember";
import type { PublicRsvp, RsvpResponse } from "@/lib/types";
import { DeviceNote } from "./DeviceNote";
import { FormActions, useSubmit } from "./FormActions";

const CHOICES: { value: RsvpResponse; label: string; active: string }[] = [
  { value: "yes", label: "Yes", active: "bg-palm text-white border-palm" },
  { value: "maybe", label: "Maybe", active: "bg-gold text-white border-gold" },
  { value: "no", label: "No", active: "bg-coral text-white border-coral" },
];

export function RsvpForm({
  eventId,
  rsvp,
  onDone,
}: {
  eventId: string;
  rsvp?: PublicRsvp;
  onDone: () => void;
}) {
  const { mutate } = useSWRConfig();
  const { busy, error, run } = useSubmit();
  const [name, setName] = useState(() => rsvp?.name ?? rememberedName());
  const [count, setCount] = useState(rsvp?.count ?? 1);
  const [response, setResponse] = useState<RsvpResponse | null>(rsvp?.response ?? null);
  const [localError, setLocalError] = useState<string | null>(null);

  const key = KEYS.rsvps(eventId);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!response) {
      setLocalError("Pick Yes, Maybe, or No.");
      return;
    }
    setLocalError(null);
    run(async () => {
      const body = { name, count, response };
      const saved = rsvp
        ? await api<PublicRsvp>(`${key}/${rsvp.id}`, "PATCH", body)
        : await api<PublicRsvp>(key, "POST", body);
      rememberName(name);
      await mutate<PublicRsvp[]>(key, (list) => upsert(list, saved), { revalidate: false });
      await mutate(KEYS.rsvpCounts);
      onDone();
    });
  }

  function remove() {
    if (!rsvp) return;
    run(async () => {
      await api(`${key}/${rsvp.id}`, "DELETE");
      await mutate<PublicRsvp[]>(key, (list) => without(list, rsvp.id), { revalidate: false });
      await mutate(KEYS.rsvpCounts);
      onDone();
    });
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className="field-label" htmlFor="rsvp-name">
          Name or party
        </label>
        <input
          id="rsvp-name"
          className="field"
          placeholder="e.g. The Meyers"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <span className="field-label">Number of people</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn btn-secondary size-12 p-0 text-2xl"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            aria-label="One fewer person"
          >
            −
          </button>
          <span className="min-w-8 text-center font-serif text-2xl font-bold" aria-live="polite">
            {count}
          </span>
          <button
            type="button"
            className="btn btn-secondary size-12 p-0 text-2xl"
            onClick={() => setCount((c) => Math.min(50, c + 1))}
            aria-label="One more person"
          >
            +
          </button>
        </div>
      </div>

      <fieldset>
        <legend className="field-label">Are you coming?</legend>
        <div className="grid grid-cols-3 gap-2">
          {CHOICES.map((choice) => (
            <label
              key={choice.value}
              className={`btn cursor-pointer rounded-lg border-2 ${
                response === choice.value
                  ? choice.active
                  : "border-navy/25 bg-white text-navy"
              }`}
            >
              <input
                type="radio"
                name="response"
                value={choice.value}
                className="sr-only"
                checked={response === choice.value}
                onChange={() => setResponse(choice.value)}
              />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>

      <DeviceNote />

      <FormActions
        busy={busy}
        error={localError ?? error}
        submitLabel={rsvp ? "Save changes" : "Send RSVP"}
        onDelete={rsvp ? remove : undefined}
        deleteLabel="Remove my RSVP"
      />
    </form>
  );
}
