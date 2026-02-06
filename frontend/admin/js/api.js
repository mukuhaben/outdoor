
// api.js — SINGLE SOURCE OF TRUTH

const API_ORIGIN = "https://outdoor-06p8.onrender.com";

function getToken() {
  return localStorage.getItem("adminToken");
}

/**
 * ADMIN (protected) API
 * /api/admin/...
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(
    API_ORIGIN + "/api/admin" + endpoint,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    }
  );

  if (response.status === 401) {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
    return;
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * PUBLIC EVENTS (read-only)
 * /api/events
 */
async function apiFetchPublicEvents(endpoint = "") {
  const response = await fetch(
    API_ORIGIN + "/api/events" + endpoint
  );

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * ADMIN ACTIVITIES
 * /api/admin/activities
 */
async function apiFetchActivities(endpoint = "") {
  return apiFetch("/activities" + endpoint);
}



/*const API_BASE = "https://outdoor-06p8.onrender.com/api/admin";

function getToken() {
  return localStorage.getItem("adminToken");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    alert("Session expired. Please log in again.");
    window.location.href = "admin-login.html";
    return;
  }

  return response.json();
}

// for admin events page to avoid 404
async function apiFetchEvents(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch("/api" + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
//same for activities in event-form.js
async function apiFetchEvents(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch("/api" + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}*/