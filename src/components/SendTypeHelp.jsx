import { SENDS } from "../constants";

const DESCRIPTIONS = {
  Flash: "Sent first try, after watching someone else or getting beta.",
  Onsight: "Sent first try, with zero beta or prior knowledge.",
  Redpoint: "Sent after one or more earlier attempts.",
  Attempt: "Didn't send - still working the moves or the project.",
};

export function SendTypeHelp() {
  return (
    <span className="info-wrap">
      <button type="button" className="info-btn" aria-label="What do send types mean?">i</button>
      <span className="info-pop" role="tooltip">
        <dl style={{ margin: 0 }}>
          {SENDS.map((send) => <span key={send}><dt>{send}</dt><dd>{DESCRIPTIONS[send]}</dd></span>)}
        </dl>
      </span>
    </span>
  );
}
