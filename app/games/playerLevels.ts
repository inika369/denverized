export type PlayerLevel = {
  level: number;
  name: string;
  surname: string;
  number: number;
  salary: number;
  radius: number;
  color: string;
};

type RawPlayer = {
  name: string;
  surname: string;
  number: number;
  salary: number;
};

const RAW_PLAYERS: RawPlayer[] = [
  { name: "Trevon Brazile", surname: "BRAZILE", number: 7, salary: 1_357_763 },
  { name: "DaRon Holmes II", surname: "HOLMES II", number: 14, salary: 3_372_120 },
  { name: "Julian Strawther", surname: "STRAWTHER", number: 3, salary: 4_826_931 },
  { name: "Zeke Nnaji", surname: "NNAJI", number: 22, salary: 7_466_667 },
  { name: "Christian Braun", surname: "BRAUN", number: 0, salary: 21_551_726 },
  { name: "Cameron Johnson", surname: "JOHNSON", number: 23, salary: 23_062_500 },
  { name: "Aaron Gordon", surname: "GORDON", number: 32, salary: 31_978_037 },
  { name: "Jamal Murray", surname: "MURRAY", number: 27, salary: 50_105_628 },
  { name: "Nikola Jokić", surname: "JOKIĆ", number: 15, salary: 59_033_114 },
];

const MIN_RADIUS = 24;
const MAX_RADIUS = 100;

const NAVY_RGB = { r: 0x0e, g: 0x22, b: 0x40 };
const GOLD_RGB = { r: 0xfe, g: 0xc5, b: 0x24 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function levelColor(t: number): string {
  const r = Math.round(lerp(NAVY_RGB.r, GOLD_RGB.r, t));
  const g = Math.round(lerp(NAVY_RGB.g, GOLD_RGB.g, t));
  const b = Math.round(lerp(NAVY_RGB.b, GOLD_RGB.b, t));
  return `rgb(${r}, ${g}, ${b})`;
}

export const PLAYER_LEVELS: PlayerLevel[] = RAW_PLAYERS.map((p, i) => {
  const t = i / (RAW_PLAYERS.length - 1);
  const radius = Math.round(
    MIN_RADIUS * Math.pow(MAX_RADIUS / MIN_RADIUS, t)
  );
  return {
    level: i + 1,
    name: p.name,
    surname: p.surname,
    number: p.number,
    salary: p.salary,
    radius,
    color: levelColor(t),
  };
});

export const MAX_LEVEL = PLAYER_LEVELS.length;

/** Score awarded is the player's salary expressed in units of 10,000 dollars. */
export function salaryToScore(salary: number): number {
  return Math.round(salary / 10_000);
}
