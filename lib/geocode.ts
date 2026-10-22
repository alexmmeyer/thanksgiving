export class GeocodeError extends Error {}

type GeocodeResponse = {
  status: string;
  error_message?: string;
  results: { geometry: { location: { lat: number; lng: number } } }[];
};

export async function geocode(address: string): Promise<{ lat: number; lng: number }> {
  const key = process.env.GOOGLE_GEOCODING_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key) throw new GeocodeError("Address lookup isn't set up yet (missing Google key).");

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address.replace(/\s*\n\s*/g, ", "));
  url.searchParams.set("region", "us");
  url.searchParams.set("key", key);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new GeocodeError("Couldn't reach the address lookup service. Try again.");
  const body = (await res.json()) as GeocodeResponse;

  if (body.status === "ZERO_RESULTS" || body.results.length === 0) {
    throw new GeocodeError("We couldn't find that address. Check the spelling and include the city.");
  }
  if (body.status !== "OK") {
    throw new GeocodeError(`Address lookup failed (${body.error_message ?? body.status}).`);
  }
  return body.results[0].geometry.location;
}
