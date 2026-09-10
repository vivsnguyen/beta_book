# Beta Book

A climbing progress tracker — grade progression charts, session stats, and a filterable send log.

## What it is

A single self-contained HTML file (`index.html`). No build step, no dependencies to install.

- Vanilla HTML/CSS/JS
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
