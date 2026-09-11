import { BOULDER_GRADES, ROUTE_GRADES, disciplineOf, monthKey } from "../constants";

function highestGrade(climbs, discipline, grades) {
  const best = Math.max(-1, ...climbs.filter((climb) => climb.send !== "Attempt" && disciplineOf(climb.style) === discipline).map((climb) => grades.indexOf(climb.grade)));
  return best >= 0 ? grades[best] : "-";
}

export function Stats({ climbs }) {
  const sent = climbs.filter((climb) => climb.send !== "Attempt");
  const sessions = new Set(climbs.map((climb) => climb.date)).size;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const tiles = [
    ["Total climbs", climbs.length, ""],
    ["Sessions logged", sessions, ""],
    ["Hardest boulder", highestGrade(climbs, "boulder", BOULDER_GRADES), "boulder"],
    ["Hardest route", highestGrade(climbs, "route", ROUTE_GRADES), "route"],
    ["Send rate", `${climbs.length ? Math.round((sent.length / climbs.length) * 100) : 0}%`, ""],
    ["This month", climbs.filter((climb) => monthKey(climb.date) === currentMonth).length, ""],
  ];

  return (
    <section className="stats" aria-label="Summary stats">
      {tiles.map(([label, value, className]) => (
        <div className="stat" key={label}>
          <span className="label">{label}</span>
          <span className={`value ${className}`}>{value}</span>
          {label === "This month" && <span className="sub">climbs logged</span>}
        </div>
      ))}
    </section>
  );
}
