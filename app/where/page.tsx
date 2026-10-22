import { Suspense } from "react";
import { WhereView } from "./WhereView";

export default function WherePage() {
  return (
    <Suspense fallback={<p className="text-navy/70">Loading the map...</p>}>
      <WhereView />
    </Suspense>
  );
}
