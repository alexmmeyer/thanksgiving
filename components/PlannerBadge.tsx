"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { usePlanner } from "./Providers";
import { StarIcon } from "./icons";

export function PlannerBadge() {
  const { planner, logOut } = usePlanner();
  const [open, setOpen] = useState(false);

  if (!planner) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-cream"
      >
        <StarIcon size={14} />
        Planner mode
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Planner mode">
        <div className="space-y-4">
          <p className="text-navy/80">
            You can add, edit, and delete events, family groups, dishes, and RSVPs on this device.
          </p>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={async () => {
              await logOut();
              setOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      </Modal>
    </>
  );
}
