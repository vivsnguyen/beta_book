# Beta Book

A climbing progress tracker — grade progression charts, session stats, and a filterable send log.

## What it is

A Vite-powered React app backed by a local SQLite database. The client is organized into JSX components under `src/`, while the API server lives in `server.js`.

- React UI with JSX components and browser state
- Node API with SQLite persistence in `beta-book.sqlite`
- Inline SVG charts (hand-drawn, no charting library)
- Data is saved locally in SQLite — private to this project directory

## Running it

Install Node.js 22.5 or newer, then start the production application:

```sh
npm start
```

then visit `http://localhost:8000`.

The command builds the JSX client and starts the SQLite server. The server creates `beta-book.sqlite` automatically and exposes the climb log through `/api/climbs`.

For development with Vite hot reload, run the API server and client separately:

```sh
npm start
npm run dev
```

Then visit the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Tracking

Each climb logs: date, style (Boulder / Sport / Trad / Top Rope), grade (V-scale or YDS),
send type (Flash / Onsight / Redpoint / Attempt), attempts, effort (RPE 1–10), location, and wall angle.
