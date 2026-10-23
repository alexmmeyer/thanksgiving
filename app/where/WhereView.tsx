"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DirectionsButton } from "@/components/DirectionsButton";
import { GroupForm } from "@/components/GroupForm";
import { ChevronRightIcon, PinIcon, PlusIcon, StarIcon } from "@/components/icons";
import { EmptyState, PageTitle } from "@/components/ItemTile";
import { MapView, mapsConfigured } from "@/components/MapView";
import { Modal } from "@/components/Modal";
import { PlaceForm } from "@/components/PlaceForm";
import { PlacePin } from "@/components/PlacePin";
import { usePlanner } from "@/components/Providers";
import { StarPin } from "@/components/StarPin";
import { useGroups, usePlaces } from "@/lib/hooks";
import { formatDate, type Group, type Place } from "@/lib/types";

type Tab = "houses" | "things";
type Sheet = { mode: "view" | "edit"; id: string } | { mode: "new" } | null;

const TABS: { id: Tab; label: string }[] = [
  { id: "houses", label: "Houses" },
  { id: "things", label: "Things to do" },
];

export function WhereView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const linkedGroup = searchParams.get("group");
  const linkedPlace = searchParams.get("place");
  const [tab, setTab] = useState<Tab>(
    linkedPlace || searchParams.get("tab") === "things" ? "things" : "houses",
  );

  function changeTab(next: Tab) {
    setTab(next);
    router.replace(next === "things" ? `${pathname}?tab=things` : pathname, { scroll: false });
  }

  /** Drops ?group= / ?place= once its sheet is closed, keeping the current tab. */
  function clearLink() {
    if (!linkedGroup && !linkedPlace) return;
    router.replace(tab === "things" ? `${pathname}?tab=things` : pathname, { scroll: false });
  }

  return (
    <>
      <PageTitle
        kicker="Cape San Blas · Florida"
        title={tab === "houses" ? "Where Everyone's Staying" : "Things to Do Nearby"}
      />

      <div role="tablist" aria-label="Map" className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-sand-deep/70 p-1">
        {TABS.map(({ id, label }) => {
          const selected = id === tab;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => changeTab(id)}
              className={`min-h-11 rounded-full font-semibold transition-colors ${
                selected ? "bg-navy text-cream shadow" : "text-navy/75 hover:text-navy"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {tab === "houses" ? (
          <HousesTab linkedId={linkedGroup} onLinkClosed={clearLink} />
        ) : (
          <ThingsTab linkedId={linkedPlace} onLinkClosed={clearLink} />
        )}
      </div>
    </>
  );
}

function useSheet(linkedId: string | null, onLinkClosed: () => void) {
  const [sheet, setSheet] = useState<Sheet>(linkedId ? { mode: "view", id: linkedId } : null);
  const selectedId = sheet && sheet.mode !== "new" ? sheet.id : null;
  function close() {
    setSheet(null);
    if (linkedId) onLinkClosed();
  }
  return { sheet, setSheet, selectedId, close };
}

function MapFrame({
  map,
  fallback,
  addLabel,
  onAdd,
}: {
  map: ReactNode;
  fallback: string;
  addLabel: string;
  onAdd?: () => void;
}) {
  return (
    <>
      <div className="relative -mx-4 h-[62dvh] min-h-80 overflow-hidden border-y border-navy/20 bg-aqua/30 sm:mx-0 sm:rounded-xl sm:border">
        {mapsConfigured ? (
          map
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-navy/70">{fallback}</div>
        )}
        {onAdd && (
          <button type="button" className="btn btn-accent absolute right-4 bottom-4 shadow-lg" onClick={onAdd}>
            <PlusIcon /> {addLabel}
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-sm text-navy/65">Tap a pin to see details and get directions.</p>
    </>
  );
}

function ListHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="caps mb-3 flex items-center gap-3 font-bold">
      {children}
      <span className="h-px flex-1 bg-navy/25" />
    </h2>
  );
}

function ListRow({ icon, title, subtitle, onClick }: { icon: ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="label-card flex w-full items-center gap-3 p-3 text-left">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-serif font-bold">{title}</span>
        <span className="block truncate text-sm text-navy/70">{subtitle}</span>
      </span>
      <ChevronRightIcon size={20} className="shrink-0 text-navy/50" />
    </button>
  );
}

function AddressCard({ address, lat, lng }: { address: string; lat: number; lng: number }) {
  return (
    <div className="label-card p-4">
      <p className="caps mb-1 text-turquoise-deep">Address</p>
      <p className="whitespace-pre-line">{address}</p>
      <div className="mt-3">
        <DirectionsButton lat={lat} lng={lng} />
      </div>
    </div>
  );
}

function HousesTab({ linkedId, onLinkClosed }: { linkedId: string | null; onLinkClosed: () => void }) {
  const { planner } = usePlanner();
  const { data: groups = [], isLoading, error } = useGroups();
  const { sheet, setSheet, selectedId, close } = useSheet(linkedId, onLinkClosed);

  const current = selectedId ? groups.find((g) => g.id === selectedId) : undefined;
  const sheetOpen =
    sheet?.mode === "new" || (sheet !== null && current !== undefined && (sheet.mode === "view" || planner));

  return (
    <>
      <MapFrame
        map={
          <MapView
            items={groups}
            selectedId={selectedId}
            onSelect={(g) => setSheet({ mode: "view", id: g.id })}
            renderPin={(g, selected) => <StarPin group={g} selected={selected} />}
            zIndex={(g) => (g.isMainHouse ? 500 : undefined)}
          />
        }
        fallback="The map needs a Google Maps key. The list of houses is below."
        addLabel="Add group"
        onAdd={planner ? () => setSheet({ mode: "new" }) : undefined}
      />

      <section className="mt-6">
        <ListHeading>All houses</ListHeading>
        {isLoading && <p className="text-navy/70">Loading...</p>}
        {error && <p className="text-coral">Couldn&apos;t load the houses. Please refresh the page.</p>}
        {!isLoading && groups.length === 0 && <EmptyState>No houses added yet.</EmptyState>}
        <ul className="space-y-2">
          {groups.map((g) => (
            <li key={g.id}>
              <ListRow
                icon={<StarIcon size={22} className={`shrink-0 ${g.isMainHouse ? "text-gold" : "text-navy"}`} />}
                title={g.name}
                subtitle={g.address.split("\n")[0]}
                onClick={() => setSheet({ mode: "view", id: g.id })}
              />
            </li>
          ))}
        </ul>
      </section>

      <Modal
        open={sheetOpen}
        onClose={close}
        title={
          sheet?.mode === "new" ? (
            "Add group"
          ) : sheet?.mode === "edit" ? (
            "Edit group"
          ) : current ? (
            <span>
              {current.name}
              {current.isMainHouse && <span className="caps mt-0.5 block text-[0.7rem] text-gold">Main House</span>}
            </span>
          ) : (
            ""
          )
        }
      >
        {sheet?.mode === "new" && (
          <GroupForm key="new" onSaved={(g) => setSheet({ mode: "view", id: g.id })} onDeleted={close} />
        )}
        {sheet?.mode === "edit" && current && (
          <GroupForm
            key={current.id}
            group={current}
            onSaved={(g) => setSheet({ mode: "view", id: g.id })}
            onDeleted={close}
          />
        )}
        {sheet?.mode === "view" && current && (
          <GroupDetail group={current} onEdit={planner ? () => setSheet({ mode: "edit", id: current.id }) : undefined} />
        )}
      </Modal>
    </>
  );
}

function GroupDetail({ group, onEdit }: { group: Group; onEdit?: () => void }) {
  return (
    <div className="space-y-5">
      {group.detail && <p className="whitespace-pre-line text-lg">{group.detail}</p>}

      <AddressCard address={group.address} lat={group.lat} lng={group.lng} />

      <div className="grid grid-cols-2 gap-3">
        <div className="label-card p-4">
          <p className="caps mb-1 text-turquoise-deep">Arrival</p>
          <p className="font-serif text-lg font-bold">{formatDate(group.arrival, "short")}</p>
        </div>
        <div className="label-card p-4">
          <p className="caps mb-1 text-turquoise-deep">Departure</p>
          <p className="font-serif text-lg font-bold">{formatDate(group.departure, "short")}</p>
        </div>
      </div>

      {onEdit && (
        <button type="button" className="btn btn-secondary w-full" onClick={onEdit}>
          Edit group
        </button>
      )}
    </div>
  );
}

function ThingsTab({ linkedId, onLinkClosed }: { linkedId: string | null; onLinkClosed: () => void }) {
  const { planner } = usePlanner();
  const { data: places = [], isLoading, error } = usePlaces();
  const { sheet, setSheet, selectedId, close } = useSheet(linkedId, onLinkClosed);

  const current = selectedId ? places.find((p) => p.id === selectedId) : undefined;
  const sheetOpen =
    sheet?.mode === "new" || (sheet !== null && current !== undefined && (sheet.mode === "view" || planner));

  return (
    <>
      <MapFrame
        map={
          <MapView
            items={places}
            selectedId={selectedId}
            onSelect={(p) => setSheet({ mode: "view", id: p.id })}
            renderPin={(p, selected) => <PlacePin place={p} selected={selected} />}
          />
        }
        fallback="The map needs a Google Maps key. The list of places is below."
        addLabel="Add place"
        onAdd={planner ? () => setSheet({ mode: "new" }) : undefined}
      />

      <section className="mt-6">
        <ListHeading>All places</ListHeading>
        {isLoading && <p className="text-navy/70">Loading...</p>}
        {error && <p className="text-coral">Couldn&apos;t load the places. Please refresh the page.</p>}
        {!isLoading && places.length === 0 && <EmptyState>No places added yet.</EmptyState>}
        <ul className="space-y-2">
          {places.map((p) => (
            <li key={p.id}>
              <ListRow
                icon={<PinIcon size={22} className="shrink-0 text-turquoise-deep" />}
                title={p.name}
                subtitle={p.description.split("\n")[0] || p.address.split("\n")[0]}
                onClick={() => setSheet({ mode: "view", id: p.id })}
              />
            </li>
          ))}
        </ul>
      </section>

      <Modal
        open={sheetOpen}
        onClose={close}
        title={sheet?.mode === "new" ? "Add place" : sheet?.mode === "edit" ? "Edit place" : (current?.name ?? "")}
      >
        {sheet?.mode === "new" && (
          <PlaceForm key="new" onSaved={(p) => setSheet({ mode: "view", id: p.id })} onDeleted={close} />
        )}
        {sheet?.mode === "edit" && current && (
          <PlaceForm
            key={current.id}
            place={current}
            onSaved={(p) => setSheet({ mode: "view", id: p.id })}
            onDeleted={close}
          />
        )}
        {sheet?.mode === "view" && current && (
          <PlaceDetail place={current} onEdit={planner ? () => setSheet({ mode: "edit", id: current.id }) : undefined} />
        )}
      </Modal>
    </>
  );
}

const PHONE = /(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4})/;

/** Renders phone numbers in free text as tap-to-call links. */
function WithPhoneLinks({ text }: { text: string }) {
  return text.split(PHONE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={`tel:${part.replace(/\D/g, "")}`}
        className="font-semibold whitespace-nowrap text-turquoise-deep underline underline-offset-4"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function PlaceDetail({ place, onEdit }: { place: Place; onEdit?: () => void }) {
  return (
    <div className="space-y-5">
      {place.description && (
        <p className="whitespace-pre-line text-lg">
          <WithPhoneLinks text={place.description} />
        </p>
      )}

      <AddressCard address={place.address} lat={place.lat} lng={place.lng} />

      {onEdit && (
        <button type="button" className="btn btn-secondary w-full" onClick={onEdit}>
          Edit place
        </button>
      )}
    </div>
  );
}
