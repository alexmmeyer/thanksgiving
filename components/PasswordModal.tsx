"use client";

import { useState } from "react";
import { errorMessage } from "@/lib/client";
import { Modal } from "./Modal";
import { usePlanner } from "./Providers";

export function PasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logIn } = usePlanner();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function close() {
    setPassword("");
    setError(null);
    onClose();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await logIn(password);
      close();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="Planner login">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-navy/80">
          Planners can add and edit the schedule and the family groups on the map.
        </p>
        <div>
          <label htmlFor="planner-password" className="field-label">
            Password
          </label>
          <input
            id="planner-password"
            type="password"
            autoComplete="current-password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && <p className="font-semibold text-coral">{error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={busy || !password}>
          {busy ? "Checking..." : "Log in"}
        </button>
      </form>
    </Modal>
  );
}
