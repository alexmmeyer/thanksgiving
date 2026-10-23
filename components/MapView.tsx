"use client";

import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, type ReactNode } from "react";

const CAPE_SAN_BLAS = { lat: 29.6716, lng: -85.3466 };
const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export const mapsConfigured = Boolean(MAP_KEY);

type MapItem = { id: string; name: string; lat: number; lng: number };

function FitBounds({ items }: { items: MapItem[] }) {
  const map = useMap();
  const signature = items.map((i) => `${i.id}:${i.lat},${i.lng}`).join("|");

  useEffect(() => {
    if (!map || items.length === 0) return;
    if (items.length === 1) {
      map.setCenter(items[0]);
      map.setZoom(16);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    items.forEach((i) => bounds.extend(i));
    // Extra top padding leaves room for the label cards above each pin.
    map.fitBounds(bounds, { top: 90, right: 50, bottom: 40, left: 50 });
    // Only refit when the set of pins changes, not on every poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);

  return null;
}

export function MapView<T extends MapItem>({
  items,
  selectedId,
  onSelect,
  renderPin,
  zIndex,
}: {
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  renderPin: (item: T, selected: boolean) => ReactNode;
  zIndex?: (item: T) => number | undefined;
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
        {items.map((item) => (
          <AdvancedMarker
            key={item.id}
            position={item}
            title={item.name}
            zIndex={item.id === selectedId ? 1000 : zIndex?.(item)}
            onClick={() => onSelect(item)}
          >
            {renderPin(item, item.id === selectedId)}
          </AdvancedMarker>
        ))}
        <FitBounds items={items} />
      </Map>
    </APIProvider>
  );
}
