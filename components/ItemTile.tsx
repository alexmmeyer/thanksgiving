import type { ReactNode } from "react";
import { PencilIcon } from "./icons";

export function ItemTile({
  children,
  onEdit,
  editLabel = "Edit",
  className = "",
}: {
  children: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
}) {
  return (
    <div className={`label-card relative p-4 ${className}`}>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-turquoise-deep hover:bg-turquoise/10"
        >
          <PencilIcon size={16} />
          {editLabel}
        </button>
      )}
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-navy/30 px-4 py-8 text-center text-navy/70">
      {children}
    </div>
  );
}

export function PageTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mb-5">
      {kicker && <p className="caps text-turquoise-deep">{kicker}</p>}
      <h1 className="font-serif text-3xl font-bold">{title}</h1>
    </div>
  );
}
