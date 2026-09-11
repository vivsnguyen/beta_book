# Beta Book

A climbing progress tracker — grade progression charts, session stats, and a filterable send log.

## What it is

A lightweight React app served from `index.html`, with no build step or package install required. React and ReactDOM are loaded from the browser CDN, while the application components live in `app.js`.

- React UI with browser state and localStorage persistence
- Inline SVG charts (hand-drawn, no charting library)
- Data is saved to the browser's `localStorage` — private to whichever browser/device you use it in

## Running it

Just open `index.html` in a browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Tracking

Each climb logs: date, style (Boulder / Sport / Trad / Top Rope), grade (V-scale or YDS),
send type (Flash / Onsight / Redpoint / Attempt), attempts, effort (RPE 1–10), location, and wall angle.
