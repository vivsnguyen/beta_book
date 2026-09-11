async function request(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "The database request failed");
  }
  return response.status === 204 ? null : response.json();
}

export function getClimbs() {
  return request("/api/climbs");
}

export function createClimb(climb) {
  return request("/api/climbs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(climb),
  });
}

export function removeClimb(id) {
  return request(`/api/climbs/${encodeURIComponent(id)}`, { method: "DELETE" });
}
