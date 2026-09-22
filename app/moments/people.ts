// Names are stored and displayed in English only — one spelling per person, so
// there is no second representation to keep in sync.
//
// This registry is optional metadata: a moment may tag anyone by name, and a
// name that isn't listed here simply falls back to the "other" role. Register
// people here when you want them coloured and grouped correctly in the UI.

export type PersonRole =
  | "nuggets-player"
  | "nuggets-staff"
  | "opponent"
  | "other";

export const PERSON_ROLES: Record<string, PersonRole> = {
  // Current roster
  "Nikola Jokic": "nuggets-player",
  "Jamal Murray": "nuggets-player",
  "Aaron Gordon": "nuggets-player",
  "Michael Porter Jr.": "nuggets-player",
  "Christian Braun": "nuggets-player",
  "Peyton Watson": "nuggets-player",
  "Julian Strawther": "nuggets-player",
  "Zeke Nnaji": "nuggets-player",
  "Cameron Johnson": "nuggets-player",
  "Tim Hardaway Jr.": "nuggets-player",
  "Jonas Valanciunas": "nuggets-player",
  "Bruce Brown": "nuggets-player",
  "Spencer Jones": "nuggets-player",
  "Jalen Pickett": "nuggets-player",
  "Hunter Tyson": "nuggets-player",
  "DaRon Holmes II": "nuggets-player",

  // Championship-era and other recent names
  "Kentavious Caldwell-Pope": "nuggets-player",
  "Jeff Green": "nuggets-player",
  "DeAndre Jordan": "nuggets-player",
  "Reggie Jackson": "nuggets-player",
  "Vlatko Cancar": "nuggets-player",
  "Monte Morris": "nuggets-player",
  "Will Barton": "nuggets-player",
  "Gary Harris": "nuggets-player",
  "Paul Millsap": "nuggets-player",
  "Torrey Craig": "nuggets-player",
  "Mason Plumlee": "nuggets-player",
  "Bones Hyland": "nuggets-player",
  "Russell Westbrook": "nuggets-player",

  // Franchise history
  "Alex English": "nuggets-player",
  "Dikembe Mutombo": "nuggets-player",
  "Carmelo Anthony": "nuggets-player",
  "Allen Iverson": "nuggets-player",
  "Chauncey Billups": "nuggets-player",
  "David Thompson": "nuggets-player",
  "Fat Lever": "nuggets-player",
  "Mahmoud Abdul-Rauf": "nuggets-player",
  "Antonio McDyess": "nuggets-player",
  "Marcus Camby": "nuggets-player",
  "Kenneth Faried": "nuggets-player",
  "Danilo Gallinari": "nuggets-player",
  "Ty Lawson": "nuggets-player",
  "JaVale McGee": "nuggets-player",
  Nene: "nuggets-player",

  // Staff / front office
  "David Adelman": "nuggets-staff",
  "Michael Malone": "nuggets-staff",
  "Ben Tenzer": "nuggets-staff",
  "Calvin Booth": "nuggets-staff",
  "Josh Kroenke": "nuggets-staff",
};

export function getPersonRole(name: string): PersonRole {
  return PERSON_ROLES[name] ?? "other";
}

export const PERSON_ROLE_ORDER: PersonRole[] = [
  "nuggets-player",
  "nuggets-staff",
  "opponent",
  "other",
];

export const PERSON_ROLE_STYLES: Record<PersonRole, string> = {
  "nuggets-player": "bg-gold text-navy-dark",
  "nuggets-staff": "bg-gold-dark text-navy-dark",
  opponent: "border border-navy-light text-foreground/70",
  other: "border border-navy-light text-foreground/60",
};
