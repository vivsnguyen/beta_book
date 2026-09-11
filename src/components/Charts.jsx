import { BOULDER_GRADES, ROUTE_GRADES, disciplineOf, formatDate, monthKey, monthLabel } from "../constants";

function EmptyChart({ message }) {
  return <svg viewBox="0 0 460 220" role="img"><text className="empty-chart" x="230" y="110" textAnchor="middle">{message}</text></svg>;
}

function ProgressChart({ climbs, kind, title, subtitle }) {
  const scale = kind === "boulder" ? BOULDER_GRADES : ROUTE_GRADES;
  const items = climbs.filter((climb) => disciplineOf(climb.style) === kind).sort((a, b) => a.date.localeCompare(b.date));
  if (!items.length) return <div className="chart-card"><h3>{title}</h3><p className="chart-sub">{subtitle}</p><EmptyChart message={`Log a ${kind} to see progress`} /></div>;
  const sent = items.filter((climb) => climb.send !== "Attempt");
  const best = Math.max(-1, ...sent.map((climb) => scale.indexOf(climb.grade)));
  const min = Math.max(0, Math.min(...items.map((climb) => scale.indexOf(climb.grade))) - 1);
  const max = Math.min(scale.length - 1, Math.max(best, min + 1) + 1);
  const x = (index) => 46 + (index / Math.max(1, items.length - 1)) * 360;
  const y = (rank) => 180 - ((rank - min) / Math.max(1, max - min)) * 150;
  const points = sent.reduce((result, climb) => { const rank = scale.indexOf(climb.grade); if (rank >= 0 && (!result.length || rank > result.at(-1).rank)) result.push({ rank, index: items.indexOf(climb) }); return result; }, []);
  const path = points.length ? `${points.map((point, index) => `${index ? "L" : "M"} ${x(point.index)} ${y(point.rank)}`).join(" ")} L 406 ${y(points.at(-1).rank)}` : "";

  return <div className="chart-card"><h3>{title}</h3><p className="chart-sub">{subtitle}</p><svg viewBox="0 0 460 220" role="img" style={{ color: `var(--${kind})` }}>
    {[min, best, max].filter((rank, index, ticks) => rank >= 0 && ticks.indexOf(rank) === index).map((rank) => <g key={rank}><line className="grid-line" x1="46" x2="406" y1={y(rank)} y2={y(rank)} /><text className="axis-label" x="40" y={y(rank)} textAnchor="end" dominantBaseline="middle">{scale[rank]}</text></g>)}
    {path && <path className={`pr-line ${kind}`} d={path} />}
    {items.map((climb, index) => { const rank = scale.indexOf(climb.grade); return rank < 0 ? null : <circle key={climb.id} className={kind} cx={x(index)} cy={y(rank)} r="5" fill={climb.send === "Attempt" ? "var(--surface)" : "currentColor"} stroke="currentColor" strokeWidth="2" />; })}
    {best >= 0 && <text className={`end-label ${kind}`} x="414" y={y(best)} dominantBaseline="middle">{scale[best]}</text>}
    <text className="axis-label" x="46" y="214">{formatDate(items[0].date)}</text><text className="axis-label" x="406" y="214" textAnchor="end">{formatDate(items.at(-1).date)}</text>
  </svg></div>;
}

function VolumeChart({ climbs }) {
  const months = [...new Set(climbs.map((climb) => monthKey(climb.date)))].sort().slice(-6);
  if (!months.length) return <EmptyChart message="Log a climb to see monthly volume" />;
  const counts = months.map((month) => ({ month, boulder: climbs.filter((climb) => monthKey(climb.date) === month && disciplineOf(climb.style) === "boulder").length, route: climbs.filter((climb) => monthKey(climb.date) === month && disciplineOf(climb.style) === "route").length }));
  const max = Math.max(2, ...counts.map((count) => Math.max(count.boulder, count.route)));
  return <svg viewBox="0 0 460 220" role="img">{counts.map((count, index) => { const center = 50 + index * (360 / counts.length) + 180 / counts.length; return <g key={count.month}>{["boulder", "route"].map((kind, offset) => count[kind] ? <rect key={kind} className={`bar-${kind}`} x={center - 18 + offset * 22} y={180 - (count[kind] / max) * 145} width="18" height={(count[kind] / max) * 145} rx="4" fill={`var(--${kind})`} /> : null)}<text className="axis-label" x={center} y="210" textAnchor="middle">{monthLabel(count.month)}</text></g>; })}</svg>;
}

export function Charts({ climbs }) {
  return <section className="charts-row"><ProgressChart climbs={climbs} kind="boulder" title="Boulder progression" subtitle="Highest grade sent over time" /><ProgressChart climbs={climbs} kind="route" title="Route progression" subtitle="Sport & trad, highest grade sent" /><div className="chart-card" style={{ gridColumn: "1/-1", overflowX: "auto" }}><h3>Monthly volume</h3><p className="chart-sub">Climbs logged per month, by discipline</p><VolumeChart climbs={climbs} /><div className="legend"><span className="legend-item"><span className="swatch boulder" />Boulder</span><span className="legend-item"><span className="swatch route" />Route</span></div></div></section>;
}
