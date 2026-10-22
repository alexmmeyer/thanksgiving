"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DirectionsButton } from "@/components/DirectionsButton";
import { GroupForm } from "@/components/GroupForm";
import { ChevronRightIcon, PlusIcon, StarIcon } from "@/components/icons";
import { EmptyState, PageTitle } from "@/components/ItemTile";
import { MapView, mapsConfigured } from "@/components/MapView";
import { Modal } from "@/components/Modal";
import { usePlanner } from "@/components/Providers";
import { useGroups } from "@/lib/hooks";
import { formatDate, type Group } from "@/lib/types";

type Sheet = { mode: "view" | "edit"; id: string } | { mode: "new" } | null;

export function WhereView() {
  const { planner } = usePlanner();
  const { data: groups = [], isLoading, error } = useGroups();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const linkedId = searchParams.get("group");
  const [sheet, setSheet] = useState<Sheet>(linkedId ? { mode: "view", id: linkedId } : null);

  const current = sheet && sheet.mode !== "new" ? groups.find((g) => g.id === sheet.id) : undefined;
  const selectedId = sheet && sheet.mode !== "new" ? sheet.id : null;

  function open(group: Group) {
    setSheet({ mode: "view", id: group.id });
  }

  function close() {
    setSheet(null);
    if (linkedId) router.replace(pathname, { scroll: false });
  }

  const sheetOpen =
    sheet?.mode === "new" || (sheet !== null && current !== undefined && (sheet.mode === "view" || planner));

  return (
    <>
      <PageTitle kicker="Cape San Blas · Florida" title="Where Everyone's Staying" />

      <div className="relative -mx-4 h-[62dvh] min-h-80 overflow-hidden border-y border-navy/20 bg-aqua/30 sm:mx-0 sm:rounded-xl sm:border">
        {mapsConfigured ? (
          <MapView groups={groups} selectedId={selectedId} onSelect={open} />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-navy/70">
            The map needs a Google Maps key. The list of houses is below.
          </div>
        )}
        {planner && (
          <button
            type="button"
            className="btn btn-accent absolute right-4 bottom-4 shadow-lg"
            onClick={() => setSheet({ mode: "new" })}
          >
            <PlusIcon /> Add group
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-sm text-navy/65">Tap a star to see who&apos;s there and get directions.</p>

      <section className="mt-6">
        <h2 className="caps mb-3 flex items-center gap-3 font-bold">
          All houses
          <span className="h-px flex-1 bg-navy/25" />
        </h2>
        {isLoading && <p className="text-navy/70">Loading...</p>}
        {error && <p className="text-coral">Couldn&apos;t load the houses. Please refresh the page.</p>}
        {!isLoading && groups.length === 0 && <EmptyState>No houses added yet.</EmptyState>}
        <ul className="space-y-2">
          {groups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => open(g)}
                className="label-card flex w-full items-center gap-3 p-3 text-left"
              >
                <StarIcon size={22} className={g.isMainHouse ? "text-gold" : "text-navy"} />
                <span className="flex-1">
                  <span className="block font-serif font-bold">{g.name}</span>
                  <span className="block text-sm text-navy/70">{g.address.split("\n")[0]}</span>
                </span>
                <ChevronRightIcon size={20} className="text-navy/50" />
              </button>
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
              {current.isMainHouse && (
                <span className="caps mt-0.5 block text-[0.7rem] text-gold">Main House</span>
              )}
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

      <div className="label-card p-4">
        <p className="caps mb-1 text-turquoise-deep">Address</p>
        <p className="whitespace-pre-line">{group.address}</p>
        <div className="mt-3">
          <DirectionsButton lat={group.lat} lng={group.lng} />
        </div>
      </div>

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
