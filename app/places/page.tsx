import { Suspense } from "react";
import { PlacesView } from "./PlacesView";

export default function PlacesPage() {
  return (
    <Suspense fallback={<p className="text-navy/70">Loading the map...</p>}>
      <PlacesView />
    </Suspense>
  );
}
