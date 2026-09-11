# Beta Book

A climbing progress tracker — grade progression charts, session stats, and a filterable send log.

## What it is

A lightweight React app backed by a local SQLite database. React and ReactDOM are loaded from the browser CDN, while the application components live in `app.js` and the API server lives in `server.js`.

- React UI with browser state and localStorage persistence
- Node API with SQLite persistence in `beta-book.sqlite`
- Inline SVG charts (hand-drawn, no charting library)
- Data is saved locally in SQLite — private to this project directory

## Running it

Install Node.js 22.5 or newer, then start the application:

```sh
npm start
```

then visit `http://localhost:8000`.

The server creates `beta-book.sqlite` automatically and exposes the climb log through the `/api/climbs` endpoint.

## Tracking

Each climb logs: date, style (Boulder / Sport / Trad / Top Rope), grade (V-scale or YDS),
send type (Flash / Onsight / Redpoint / Attempt), attempts, effort (RPE 1–10), location, and wall angle.
