export const BOULDER_GRADES = [
  "VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9",
  "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17",
];

export const ROUTE_GRADES = ["5.6", "5.7", "5.8", "5.9"].flatMap((grade) => [grade]).concat(
  Array.from({ length: 6 }, (_, index) => ["a", "b", "c", "d"].map((suffix) => `5.${index + 10}${suffix}`)).flat(),
);

export const STYLES = ["Boulder", "Sport", "Trad", "Top Rope"];
export const SENDS = ["Onsight", "Flash", "Redpoint", "Attempt"];
export const ANGLES = ["Slab", "Vertical", "Overhang", "Roof"];

export const SAMPLE_CLIMBS = [
  ["2026-05-03", "Boulder", "V2", "Flash", 1, 4, "Vertical World", "Vertical", ""],
  ["2026-05-10", "Boulder", "V3", "Redpoint", 5, 7, "Vertical World", "Overhang", ""],
  ["2026-05-17", "Sport", "5.9", "Onsight", 1, 5, "Index Town Wall", "Vertical", ""],
  ["2026-05-24", "Boulder", "V3", "Flash", 1, 5, "Vertical World", "Slab", ""],
  ["2026-06-02", "Sport", "5.10a", "Redpoint", 3, 7, "Index Town Wall", "Overhang", ""],
  ["2026-06-14", "Boulder", "V4", "Redpoint", 8, 8, "Stone Gardens", "Overhang", ""],
  ["2026-06-14", "Boulder", "V4", "Attempt", 6, 9, "Stone Gardens", "Roof", "Current project"],
  ["2026-07-01", "Sport", "5.10b", "Redpoint", 4, 7, "Vantage", "Vertical", ""],
  ["2026-07-19", "Boulder", "V5", "Redpoint", 10, 9, "Stone Gardens", "Overhang", ""],
  ["2026-08-02", "Sport", "5.10c", "Onsight", 1, 6, "Index Town Wall", "Slab", ""],
  ["2026-08-20", "Boulder", "V5", "Flash", 1, 6, "Stone Gardens", "Vertical", ""],
  ["2026-09-05", "Sport", "5.10d", "Redpoint", 6, 8, "Vantage", "Overhang", ""],
].map(([date, style, grade, send, attempts, effort, location, angle, notes], index) => ({
  id: `sample-${index + 1}`, date, style, grade, send, attempts, effort, location, angle, notes, sample: true,
}));

export function disciplineOf(style) {
  return style === "Boulder" ? "boulder" : "route";
}

export function scaleFor(style) {
  return disciplineOf(style) === "boulder" ? BOULDER_GRADES : ROUTE_GRADES;
}

export function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function monthKey(date) {
  return date.slice(0, 7);
}

export function monthLabel(month) {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: "short" });
}
