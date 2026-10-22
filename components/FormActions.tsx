"use client";

import { useState } from "react";

export function FormActions({
  busy,
  error,
  submitLabel,
  onDelete,
  deleteLabel = "Delete",
}: {
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-3 pt-2">
      {error && (
        <p role="alert" className="font-semibold text-coral">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Saving..." : submitLabel}
      </button>
      {onDelete &&
        (confirming ? (
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={() => setConfirming(false)}
              disabled={busy}
            >
              Keep it
            </button>
            <button
              type="button"
              className="btn flex-1 bg-coral text-white"
              onClick={onDelete}
              disabled={busy}
            >
              Yes, delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-danger w-full"
            onClick={() => setConfirming(true)}
            disabled={busy}
          >
            {deleteLabel}
          </button>
        ))}
    </div>
  );
}

/** Wraps an async save/delete with busy and error state. */
export function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, run };
}
