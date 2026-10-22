import type { EventInput, GroupInput } from "../lib/types";

/** From locations.md. */
export const GROUPS: GroupInput[] = [
  {
    name: "Pressley/McAfee/Rabenold",
    detail: "",
    address: "119 Sea Grass Circle\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: true,
  },
  {
    name: "Meyer",
    detail: "",
    address: "127 Seahorse Lane\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: false,
  },
  {
    name: "Willey",
    detail: "",
    address: "110 Parkview Court\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: false,
  },
  {
    name: "Walker/Wascher/Ports",
    detail: "",
    address: "202 Seagrass Circle\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: false,
  },
  {
    name: "The Hudson Sandefurs",
    detail: "",
    address: "108 Seagrass Circle\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: false,
  },
  {
    name: "Diane/Cilla/Patti Lance/Anita",
    detail: "",
    address: "103 Barbados Drive\nCape San Blas, FL 32456",
    arrival: null,
    departure: null,
    isMainHouse: false,
  },
];

type SeedEvent = Omit<EventInput, "groupId" | "sortTime"> & { atMainHouse?: boolean };

/** From McAfee_Sandefur_Thanksgiving_2026_Agenda.pdf. */
export const EVENTS: SeedEvent[] = [
  {
    date: "2026-11-25",
    timeLabel: "5-ish PM",
    title: "See y'all! Chili & cornbread",
    location: "Main House",
    atMainHouse: true,
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    timeLabel: "10:00 AM",
    title: "Stretch & Skip",
    location: "Beachside",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    timeLabel: "12:00 PM",
    title: "Beach Volleyball",
    location: "",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    timeLabel: "3:30 PM",
    title: "Family Photo",
    location: "Meet at the beach",
    details:
      "White or light gray tops; khaki or denim bottoms.\nFunky & fun socks encouraged - bonus points and an award!\nPhotos begin shortly after 3:30. Late birds: tell yourself 3:00 PM!",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    timeLabel: "4:30 PM",
    title: "Prayer & Thanksgiving Feast",
    location: "Location TBD",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-27",
    timeLabel: "Time TBD",
    title: "Golf Outing",
    location: "Location TBD",
    details: "Davis Port is coordinating.",
    requiresRsvp: true,
  },
  {
    date: "2026-11-27",
    timeLabel: "12:00 PM onward",
    title: "College Football Viewing",
    location: "Host house / viewing location TBD",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-27",
    timeLabel: "5:30 PM",
    title: "Low Country Boil & fresh tunes by the Family Royals",
    location: "Main House",
    atMainHouse: true,
    details: "",
    requiresRsvp: true,
  },
];
