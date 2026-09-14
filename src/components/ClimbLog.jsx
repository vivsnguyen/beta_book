import { STYLES, disciplineOf, formatDate } from "../constants";
import { SendTypeHelp } from "./SendTypeHelp";

const LOG_PANEL_STYLE = { padding: "20px 0 0" };
const LOG_HEADER_STYLE = { padding: "0 22px 14px" };

function FilterChips({ activeFilter, onFilterChange }) {
  return (
    <div className="chips">
      {["All", ...STYLES].map((style) => (
        <button
          key={style}
          type="button"
          className="chip"
          aria-pressed={activeFilter === style}
          onClick={() => onFilterChange(style)}
        >
          {style}
        </button>
      ))}
    </div>
  );
}

function LogHeader({ activeFilter, onFilterChange }) {
  return (
    <div className="log-head" style={LOG_HEADER_STYLE}>
      <h2 style={{ margin: 0 }}>Climb log</h2>
      <FilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />
    </div>
  );
}

function LogColumnHeaders() {
  return (
    <div className="log-row head-row">
      <span>Date</span>
      <span>Grade</span>
      <span>Style / send <SendTypeHelp /></span>
      <span>Attempts</span>
      <span>Effort</span>
      <span>Location</span>
      <span />
    </div>
  );
}

function EffortMeter({ effort }) {
  const score = effort || 0;

  return (
    <span className="cell-effort">
      {score}/10
      <span className="meter">
        <span style={{ width: `${score * 10}%` }} />
      </span>
    </span>
  );
}

function ClimbRow({ climb, onDelete }) {
  const discipline = disciplineOf(climb.style);
  const sent = climb.send !== "Attempt";

  return (
    <div className="log-row">
      <span className="cell-date">
        {formatDate(climb.date)} {climb.sample && <span className="sample-tag">example</span>}
      </span>
      <span className="grade-badge">
        <span className={`dot ${discipline}`} />
        {climb.grade}
      </span>
      <span className="cell-style">
        {climb.style}
        <br />
        <span className={`send-tag${sent ? " sent" : ""}`}>
          <span className="ring" />
          {climb.send}
        </span>
      </span>
      <span>{climb.attempts || 1}x</span>
      <EffortMeter effort={climb.effort} />
      <span className="cell-where">
        {climb.location}
        <br />
        <span className="angle">{climb.angle}</span>
      </span>
      <span>
        {!climb.sample && (
          <button
            type="button"
            className="row-del"
            title="Delete"
            onClick={() => onDelete(climb.id)}
          >
            x
          </button>
        )}
      </span>
    </div>
  );
}

function LogRows({ climbs, onDelete }) {
  if (!climbs.length) {
    return <div className="empty-log">No climbs match this filter yet.</div>;
  }

  return climbs.map((climb) => (
    <ClimbRow key={climb.id} climb={climb} onDelete={onDelete} />
  ));
}

export function ClimbLog({ climbs, filter, onFilterChange, onDelete }) {
  const filteredClimbs = climbs
    .filter((climb) => filter === "All" || climb.style === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="panel" style={LOG_PANEL_STYLE}>
      <LogHeader activeFilter={filter} onFilterChange={onFilterChange} />
      <div className="log-list">
        <LogColumnHeaders />
        <LogRows climbs={filteredClimbs} onDelete={onDelete} />
      </div>
    </section>
  );
}
