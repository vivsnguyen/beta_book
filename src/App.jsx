import { useEffect, useState } from "react";
import { createClimb, getClimbs, removeClimb } from "./api/climbs";
import { SAMPLE_CLIMBS } from "./constants";
import { Charts } from "./components/Charts";
import { ClimbForm } from "./components/ClimbForm";
import { ClimbLog } from "./components/ClimbLog";
import { Stats } from "./components/Stats";

function Header({ formOpen, onToggleForm }) {
  return <header className="top"><div><p className="brand-eyebrow">Climbing Log</p><h1>Beta <span>Book</span></h1><p className="tagline">Every send, every project, every wall angle - tracked from first V0 to your current project.</p></div><button className="primary" type="button" onClick={onToggleForm}>{formOpen ? "Close form" : "+ Log a climb"}</button></header>;
}

function SampleBanner() {
  return <div className="banner"><span><span className="dot">●</span> Showing <strong>example climbs</strong> so you can see how this works.</span><span>Log your first real send below and this data disappears.</span></div>;
}

export default function App() {
  const [storedClimbs, setStoredClimbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const displayedClimbs = loading || storedClimbs.length === 0 ? SAMPLE_CLIMBS : storedClimbs;

  useEffect(() => {
    getClimbs().then(setStoredClimbs).catch((error) => setErrorMessage(error.message)).finally(() => setLoading(false));
  }, []);

  const handleSave = (data) => createClimb(data).then((climb) => { setStoredClimbs((current) => [...current, climb]); setFormOpen(false); setErrorMessage(""); }).catch((error) => setErrorMessage(error.message));
  const handleDelete = (id) => removeClimb(id).then(() => { setStoredClimbs((current) => current.filter((climb) => climb.id !== id)); setErrorMessage(""); }).catch((error) => setErrorMessage(error.message));

  return <div className="wrap"><Header formOpen={formOpen} onToggleForm={() => setFormOpen((open) => !open)} />{!loading && storedClimbs.length === 0 && <SampleBanner />}{errorMessage && <div className="banner" role="alert">{errorMessage}</div>}<Stats climbs={displayedClimbs} />{formOpen && <ClimbForm onSave={handleSave} onCancel={() => setFormOpen(false)} />}<Charts climbs={displayedClimbs} /><ClimbLog climbs={displayedClimbs} filter={filter} onFilterChange={setFilter} onDelete={handleDelete} /><footer className="note">Saved to the local SQLite database.</footer></div>;
}
