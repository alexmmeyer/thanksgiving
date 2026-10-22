"use client";

import { useState } from "react";
import { LockIcon } from "./icons";
import { PasswordModal } from "./PasswordModal";
import { usePlanner } from "./Providers";

export function LockButton() {
  const { planner } = usePlanner();
  const [open, setOpen] = useState(false);

  if (planner) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full p-2.5 text-navy/30 hover:text-navy/60"
        aria-label="Planner login"
      >
        <LockIcon size={20} />
      </button>
      <PasswordModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
