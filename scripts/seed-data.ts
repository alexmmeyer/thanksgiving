import type { EventInput, GroupInput, PlaceInput } from "../lib/types";

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

/** From things-to-do.md. Addresses looked up from each business's website or listing. */
export const PLACES: PlaceInput[] = [
  {
    name: "Skully's Low Country Boil",
    description:
      "Signature seafood · 850-247-3077\n\nA Cape favorite for shrimp, sausage, corn and potatoes. Perfect to bring back to the house. Call ahead for group orders.",
    address: "5544 Cape San Blas Rd\nPort St. Joe, FL 32456",
  },
  {
    name: "Scallop Cove General Store",
    description:
      "Ice, snacks & essentials · 850-227-1573\n\nYour handy stop for ice, drinks, groceries, beach supplies, breakfast and treats.",
    address: "4310 Cape San Blas Rd\nPort St. Joe, FL 32456",
  },
  {
    name: "Scallop RePUBlic",
    description:
      "Sunset drinks & music · 850-328-5518\n\nBay views, cold drinks, live music, cornhole and football. Our pick for a casual grown-up gathering.",
    address: "411 Cape San Blas Rd\nPort St. Joe, FL 32456",
  },
  {
    name: "Peachy's Beach Eats",
    description:
      "Easy beach lunch · 850-227-1450\n\nTacos, pulled pork and laid-back beach food after a morning on the sand.",
    address: "145 Acklins Island Dr\nPort St. Joe, FL 32456",
  },
  {
    name: "Indian Pass Raw Bar",
    description:
      "Old Florida seafood · 850-227-1670\n\nA beloved rustic seafood spot, especially for oysters and local coastal atmosphere.",
    address: "8391 County Rd 30A\nPort St. Joe, FL 32456",
  },
  {
    name: "Duren's Piggly Wiggly",
    description:
      "Full grocery run · 850-229-8398\n\nThe practical choice for stocking up on produce, meat, drinks and Thanksgiving supplies.",
    address: "125 W Highway 98\nPort St. Joe, FL 32456",
  },
  {
    name: "Scallop Cove Bait & Tackle",
    description:
      "Bikes & beach adventures · 850-227-7557\n\nAsk about bikes, kayaks, paddleboards and beach gear; explore the scenic Loggerhead Trail.",
    address: "4306 Cape San Blas Rd\nPort St. Joe, FL 32456",
  },
];

type SeedEvent = Omit<EventInput, "groupId"> & { atMainHouse?: boolean };

/** From McAfee_Sandefur_Thanksgiving_2026_Agenda.pdf. */
export const EVENTS: SeedEvent[] = [
  {
    date: "2026-11-25",
    time: "17:00",
    title: "See y'all! Chili & cornbread",
    location: "Main House",
    atMainHouse: true,
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    time: "10:00",
    title: "Stretch & Skip",
    location: "Beachside",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    time: "12:00",
    title: "Beach Volleyball",
    location: "",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    time: "15:30",
    title: "Family Photo",
    location: "Meet at the beach",
    details:
      "White or light gray tops; khaki or denim bottoms.\nFunky & fun socks encouraged - bonus points and an award!\nPhotos begin shortly after 3:30. Late birds: tell yourself 3:00 PM!",
    requiresRsvp: false,
  },
  {
    date: "2026-11-26",
    time: "16:30",
    title: "Prayer & Thanksgiving Feast",
    location: "Location TBD",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-27",
    time: null,
    title: "Golf Outing",
    location: "Location TBD",
    details: "Davis Port is coordinating.",
    requiresRsvp: true,
  },
  {
    date: "2026-11-27",
    time: "12:00",
    title: "College Football Viewing",
    location: "Host house / viewing location TBD",
    details: "",
    requiresRsvp: false,
  },
  {
    date: "2026-11-27",
    time: "17:30",
    title: "Low Country Boil & fresh tunes by the Family Royals",
    location: "Main House",
    atMainHouse: true,
    details: "",
    requiresRsvp: true,
  },
];
