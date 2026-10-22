import { Suspense } from "react";
import { RsvpView } from "./RsvpView";

export default function RsvpPage({ params }: PageProps<"/rsvp/[eventId]">) {
  return (
    <Suspense fallback={<p className="text-navy/70">Loading...</p>}>
      {params.then(({ eventId }) => (
        <RsvpView eventId={eventId} />
      ))}
    </Suspense>
  );
}
