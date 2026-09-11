"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 8000);
const ROOT_DIR = __dirname;
const STATIC_DIR = path.join(ROOT_DIR, "dist");
const database = new DatabaseSync(path.join(ROOT_DIR, "beta-book.sqlite"));

database.exec(`
  CREATE TABLE IF NOT EXISTS climbs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    style TEXT NOT NULL,
    grade TEXT NOT NULL,
    send TEXT NOT NULL,
    attempts INTEGER NOT NULL,
    effort INTEGER NOT NULL,
    location TEXT NOT NULL,
    angle TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    createdAt INTEGER NOT NULL
  )
`);

const statements = {
  list: database.prepare("SELECT * FROM climbs ORDER BY date DESC, createdAt DESC"),
  find: database.prepare("SELECT * FROM climbs WHERE id = ?"),
  insert: database.prepare(`
    INSERT INTO climbs (id, date, style, grade, send, attempts, effort, location, angle, notes, createdAt)
    VALUES (:id, :date, :style, :grade, :send, :attempts, :effort, :location, :angle, :notes, :createdAt)
  `),
  remove: database.prepare("DELETE FROM climbs WHERE id = ?"),
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (_) {
        reject(new Error("Request body must be valid JSON"));
      }
    });
    request.on("error", reject);
  });
}

function validateClimb(data) {
  const required = ["date", "style", "grade", "send", "location", "angle"];
  if (required.some((field) => typeof data[field] !== "string" || !data[field].trim())) {
    return "Date, style, grade, send, location, and angle are required";
  }
  if (!Number.isInteger(Number(data.attempts)) || Number(data.attempts) < 1) {
    return "Attempts must be a positive integer";
  }
  if (!Number.isInteger(Number(data.effort)) || Number(data.effort) < 1 || Number(data.effort) > 10) {
    return "Effort must be an integer from 1 to 10";
  }
  return null;
}

async function handleApi(request, response, url) {
  if (url.pathname === "/api/climbs" && request.method === "GET") {
    return sendJson(response, 200, statements.list.all());
  }

  if (url.pathname === "/api/climbs" && request.method === "POST") {
    const data = await readBody(request);
    const validationError = validateClimb(data);
    if (validationError) return sendJson(response, 400, { error: validationError });

    const climb = {
      id: "c" + Date.now() + Math.random().toString(36).slice(2, 7),
      date: data.date,
      style: data.style,
      grade: data.grade,
      send: data.send,
      attempts: Math.max(1, Number(data.attempts)),
      effort: Number(data.effort),
      location: data.location.trim(),
      angle: data.angle,
      notes: typeof data.notes === "string" ? data.notes.trim() : "",
      createdAt: Date.now(),
    };
    statements.insert.run(climb);
    return sendJson(response, 201, climb);
  }

  const match = url.pathname.match(/^\/api\/climbs\/([^/]+)$/);
  if (match && request.method === "DELETE") {
    const id = decodeURIComponent(match[1]);
    if (!statements.find.get(id)) return sendJson(response, 404, { error: "Climb not found" });
    statements.remove.run(id);
    return sendJson(response, 204, null);
  }

  sendJson(response, 404, { error: "Not found" });
}

function serveStatic(response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.resolve(STATIC_DIR, "." + requestedPath);
  if (!filePath.startsWith(STATIC_DIR + path.sep)) {
    response.writeHead(403);
    return response.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      return response.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }
    const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(request, response, url);
    else if (request.method === "GET") serveStatic(response, url);
    else sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    if (!response.headersSent) sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Beta Book running at http://localhost:${PORT}`);
});

function closeDatabase() {
  database.close();
  server.close();
}
process.on("SIGINT", closeDatabase);
process.on("SIGTERM", closeDatabase);
