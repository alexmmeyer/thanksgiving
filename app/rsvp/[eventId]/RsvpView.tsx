"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeftIcon, PinIcon } from "@/components/icons";
import { EmptyState, ItemTile } from "@/components/ItemTile";
import { Modal } from "@/components/Modal";
import { usePlanner } from "@/components/Providers";
import { RsvpForm } from "@/components/RsvpForm";
import { useEvents, useGroups, useRsvps } from "@/lib/hooks";
import { formatDate, formatTime, type PublicRsvp, type RsvpResponse } from "@/lib/types";

const SECTIONS: { response: RsvpResponse; title: string; dot: string }[] = [
  { response: "yes", title: "Yes", dot: "bg-palm" },
  { response: "maybe", title: "Maybe", dot: "bg-gold" },
  { response: "no", title: "No", dot: "bg-coral" },
];

type Editing = { mode: "new" } | { mode: "edit"; rsvp: PublicRsvp } | null;

export function RsvpView({ eventId }: { eventId: string }) {
  const { planner } = usePlanner();
  const { data: events, isLoading } = useEvents();
  const { data: groups = [] } = useGroups();
  const { data: rsvps = [] } = useRsvps(eventId);
  const [editing, setEditing] = useState<Editing>(null);

  const event = events?.find((e) => e.id === eventId);
  const group = groups.find((g) => g.id === event?.groupId);

  const back = (
    <Link href="/schedule" className="mb-4 inline-flex items-center gap-1 font-semibold text-turquoise-deep">
      <ChevronLeftIcon size={20} /> Schedule
    </Link>
  );

  if (isLoading) return <p className="text-navy/70">Loading...</p>;
  if (!event) {
    return (
      <>
        {back}
        <EmptyState>This event isn&apos;t on the schedule anymore.</EmptyState>
      </>
    );
  }

  const mine = rsvps.filter((r) => r.mine);

  return (
    <>
      {back}

      <section className="label-card p-5">
        <p className="caps text-turquoise-deep">
          {formatDate(event.date, "long")} · {formatTime(event.time)}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight">{event.title}</h1>
        {(event.location || group) && (
          <p className="mt-2 flex items-center gap-1 text-navy/80">
            <PinIcon size={18} />
            {group ? (
              <Link
                href={`/where?group=${group.id}`}
                className="font-semibold text-turquoise-deep underline underline-offset-4"
              >
                {event.location || group.name}
              </Link>
            ) : (
              event.location
            )}
          </p>
        )}
        {event.details && <p className="mt-3 whitespace-pre-line">{event.details}</p>}
      </section>

      {event.requiresRsvp ? (
        <button
          type="button"
          className="btn btn-primary mt-5 w-full flex-col gap-0 text-lg"
          onClick={() => setEditing({ mode: "new" })}
        >
          {mine.length > 0 ? (
            <>
              <span className="text-sm font-normal text-cream/80">
                You already RSVP&apos;d as {mine.map((r) => r.name).join(", ")}
              </span>
              RSVP for someone else
            </>
          ) : (
            "RSVP"
          )}
        </button>
      ) : (
        <p className="mt-5 text-center text-navy/70">This event isn&apos;t taking RSVPs.</p>
      )}

      <div className="mt-8 space-y-6">
        {SECTIONS.map(({ response, title, dot }) => {
          const list = rsvps.filter((r) => r.response === response);
          const people = list.reduce((n, r) => n + r.count, 0);
          return (
            <section key={response}>
              <h2 className="mb-2 flex items-center gap-2 font-serif text-xl font-bold">
                <span className={`size-3 rounded-full ${dot}`} />
                {title}
                <span className="font-sans text-base font-normal text-navy/65">
                  ({people} {people === 1 ? "person" : "people"})
                </span>
              </h2>
              {list.length === 0 ? (
                <p className="text-navy/55">Nobody yet.</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((r) => (
                    <li key={r.id}>
                      <ItemTile
                        className="py-3"
                        onEdit={
                          r.mine || planner ? () => setEditing({ mode: "edit", rsvp: r }) : undefined
                        }
                      >
                        <p className="pr-20 font-semibold">{r.name}</p>
                        <p className="text-sm text-navy/70">
                          {r.count} {r.count === 1 ? "person" : "people"}
                          {r.mine && " · you"}
                        </p>
                      </ItemTile>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === "edit" ? "Change RSVP" : `RSVP: ${event.title}`}
      >
        {editing && (
          <RsvpForm
            key={editing.mode === "edit" ? editing.rsvp.id : "new"}
            eventId={eventId}
            rsvp={editing.mode === "edit" ? editing.rsvp : undefined}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
