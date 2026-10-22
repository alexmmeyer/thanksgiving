"use client";

import { useState, useSyncExternalStore } from "react";
import { NavigateIcon } from "./icons";

function detectApple() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

const noop = () => () => {};

export function DirectionsButton({ lat, lng }: { lat: number; lng: number }) {
  const isApple = useSyncExternalStore(noop, detectApple, () => false);
  const [choosing, setChoosing] = useState(false);

  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  const apple = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;

  if (!isApple) {
    return (
      <a href={google} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
        <NavigateIcon size={20} /> Go
      </a>
    );
  }

  if (!choosing) {
    return (
      <button type="button" className="btn btn-accent" onClick={() => setChoosing(true)}>
        <NavigateIcon size={20} /> Go
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={apple} className="btn btn-accent">
        Apple Maps
      </a>
      <a href={google} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
        Google Maps
      </a>
    </div>
  );
}
