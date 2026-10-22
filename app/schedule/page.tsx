"use client";

import Link from "next/link";
import { useState } from "react";
import { EventForm } from "@/components/EventForm";
import { PinIcon, PlusIcon } from "@/components/icons";
import { EmptyState, ItemTile, PageTitle } from "@/components/ItemTile";
import { Modal } from "@/components/Modal";
import { usePlanner } from "@/components/Providers";
import { useEvents, useGroups, useRsvpCounts } from "@/lib/hooks";
import { formatDate, type EventItem, type Group } from "@/lib/types";

type Editing = { mode: "new" } | { mode: "edit"; event: EventItem } | null;

export default function SchedulePage() {
  const { planner } = usePlanner();
  const { data: events, error, isLoading } = useEvents();
  const { data: groups = [] } = useGroups();
  const { data: counts = {} } = useRsvpCounts();
  const [editing, setEditing] = useState<Editing>(null);

  const byDay = new Map<string, EventItem[]>();
  for (const event of events ?? []) {
    byDay.set(event.date, [...(byDay.get(event.date) ?? []), event]);
  }

  return (
    <>
      <PageTitle kicker="November 25-27" title="Schedule" />

      {planner && (
        <button
          type="button"
          className="btn btn-accent mb-5 w-full"
          onClick={() => setEditing({ mode: "new" })}
        >
          <PlusIcon /> Add event
        </button>
      )}

      {isLoading && <p className="text-navy/70">Loading the schedule...</p>}
      {error && <p className="text-coral">Couldn&apos;t load the schedule. Please refresh the page.</p>}
      {events && events.length === 0 && <EmptyState>No events yet.</EmptyState>}

      <div className="space-y-8">
        {[...byDay.entries()].map(([date, dayEvents]) => (
          <section key={date}>
            <h2 className="caps mb-3 flex items-center gap-3 font-bold text-navy">
              {formatDate(date, "long").replace(",", " ·")}
              <span className="h-px flex-1 bg-navy/25" />
            </h2>
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  group={groups.find((g) => g.id === event.groupId)}
                  yesCount={counts[event.id] ?? 0}
                  onEdit={planner ? () => setEditing({ mode: "edit", event }) : undefined}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {events && events.length > 0 && (
        <p className="mt-8 text-center text-sm text-navy/60">
          All times Eastern. Details subject to updates.
        </p>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === "edit" ? "Edit event" : "Add event"}
      >
        {editing && (
          <EventForm
            key={editing.mode === "edit" ? editing.event.id : "new"}
            event={editing.mode === "edit" ? editing.event : undefined}
            groups={groups}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}

function EventCard({
  event,
  group,
  yesCount,
  onEdit,
}: {
  event: EventItem;
  group?: Group;
  yesCount: number;
  onEdit?: () => void;
}) {
  const locationText = event.location || group?.name;

  return (
    <ItemTile onEdit={onEdit}>
      <p className="caps text-turquoise-deep">{event.timeLabel}</p>
      <h3 className={`mt-1 font-serif text-xl font-bold leading-snug ${onEdit ? "pr-20" : ""}`}>
        {event.title}
      </h3>

      {locationText &&
        (group ? (
          <Link
            href={`/where?group=${group.id}`}
            className="mt-1.5 inline-flex items-center gap-1 font-semibold text-turquoise-deep underline decoration-turquoise/50 underline-offset-4"
          >
            <PinIcon size={18} />
            {locationText}
          </Link>
        ) : (
          <p className="mt-1.5 flex items-center gap-1 text-navy/75">
            <PinIcon size={18} />
            {locationText}
          </p>
        ))}

      {event.details && <p className="mt-2 whitespace-pre-line text-navy/85">{event.details}</p>}

      {event.requiresRsvp && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
          <span className="text-navy/75">
            {yesCount === 0 ? "No RSVPs yet" : `${yesCount} going`}
          </span>
          <Link href={`/rsvp/${event.id}`} className="btn btn-primary">
            RSVP
          </Link>
        </div>
      )}
    </ItemTile>
  );
}
