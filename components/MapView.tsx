"use client";

import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import type { Group } from "@/lib/types";
import { StarPin } from "./StarPin";

const CAPE_SAN_BLAS = { lat: 29.6716, lng: -85.3466 };
const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export const mapsConfigured = Boolean(MAP_KEY);

function FitBounds({ groups }: { groups: Group[] }) {
  const map = useMap();
  const signature = groups.map((g) => `${g.id}:${g.lat},${g.lng}`).join("|");

  useEffect(() => {
    if (!map || groups.length === 0) return;
    if (groups.length === 1) {
      map.setCenter(groups[0]);
      map.setZoom(16);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    groups.forEach((g) => bounds.extend(g));
    // Extra top padding leaves room for the label cards above each star.
    map.fitBounds(bounds, { top: 90, right: 50, bottom: 40, left: 50 });
    // Only refit when the set of pins changes, not on every poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);

  return null;
}

export function MapView({
  groups,
  selectedId,
  onSelect,
}: {
  groups: Group[];
  selectedId: string | null;
  onSelect: (group: Group) => void;
}) {
  if (!MAP_KEY) return null;

  return (
    <APIProvider apiKey={MAP_KEY}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={CAPE_SAN_BLAS}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        className="h-full w-full"
      >
        {groups.map((group) => (
          <AdvancedMarker
            key={group.id}
            position={group}
            title={group.name}
            zIndex={group.id === selectedId ? 1000 : group.isMainHouse ? 500 : undefined}
            onClick={() => onSelect(group)}
          >
            <StarPin group={group} selected={group.id === selectedId} />
          </AdvancedMarker>
        ))}
        <FitBounds groups={groups} />
      </Map>
    </APIProvider>
  );
}
