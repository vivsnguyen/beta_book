import { useState } from "react";
import { ANGLES, BOULDER_GRADES, SENDS, STYLES, scaleFor } from "../constants";
import { SendTypeHelp } from "./SendTypeHelp";

const today = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  date: today(),
  style: "Boulder",
  grade: BOULDER_GRADES[0],
  send: "Onsight",
  angle: "Slab",
  attempts: 1,
  effort: 5,
  location: "",
  notes: "",
};

function TextField({ label, name, value, placeholder, required, onChange, className = "" }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      <input
        id={`f-${name}`}
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function SelectField({ label, name, value, options, onChange, help }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}{help}</label>
      <select id={`f-${name}`} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function EffortField({ value, onChange }) {
  return (
    <div className="field span-2">
      <label htmlFor="f-effort">Effort (RPE)</label>
      <div className="effort-row">
        <input id="f-effort" type="range" min="1" max="10" value={value} onChange={onChange} />
        <output htmlFor="f-effort">{value} / 10</output>
      </div>
    </div>
  );
}

function FormActions({ onCancel }) {
  return (
    <div className="form-actions">
      <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
      <button type="submit" className="primary">Save climb</button>
    </div>
  );
}

export function ClimbForm({ onSave, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const update = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "style" ? { grade: scaleFor(value)[0] } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.date || !form.location.trim()) return;

    const climb = {
      ...form,
      attempts: Math.max(1, Number(form.attempts) || 1),
      effort: Number(form.effort),
      location: form.location.trim(),
      notes: form.notes.trim(),
    };
    onSave(climb);
  };

  return (
    <section className="panel">
      <h2>Log a climb</h2>
      <form className="log-form" onSubmit={handleSubmit}>
        <div className="field"><label htmlFor="f-date">Date</label><input id="f-date" type="date" required value={form.date} onChange={(event) => update("date", event.target.value)} /></div>
        <SelectField label="Style" name="style" value={form.style} options={STYLES} onChange={(event) => update("style", event.target.value)} />
        <SelectField label="Grade" name="grade" value={form.grade} options={scaleFor(form.style)} onChange={(event) => update("grade", event.target.value)} />
        <SelectField label="Send type" name="send" value={form.send} options={SENDS} help={<SendTypeHelp />} onChange={(event) => update("send", event.target.value)} />
        <SelectField label="Wall angle" name="angle" value={form.angle} options={ANGLES} onChange={(event) => update("angle", event.target.value)} />
        <div className="field"><label htmlFor="f-attempts">Attempts</label><input id="f-attempts" type="number" min="1" value={form.attempts} onChange={(event) => update("attempts", event.target.value)} /></div>
        <EffortField value={form.effort} onChange={(event) => update("effort", event.target.value)} />
        <TextField label="Location" name="location" required placeholder="e.g. Stone Gardens" value={form.location} onChange={(event) => update("location", event.target.value)} className="span-2" />
        <div className="field span-4"><label htmlFor="f-notes">Notes (optional)</label><textarea id="f-notes" placeholder="Beta, crux, how it felt..." value={form.notes} onChange={(event) => update("notes", event.target.value)} /></div>
        <FormActions onCancel={onCancel} />
      </form>
    </section>
  );
}
