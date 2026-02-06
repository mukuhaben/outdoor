
const API_BASE = "/api/admin";

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

/*
const ADMIN_API_BASE = "/api/admin";
const PUBLIC_API_BASE = "/api";

function getToken() {
  return localStorage.getItem("adminToken");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(ADMIN_API_BASE + endpoint, {
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

async function apiFetchPublic(endpoint, options = {}) {
  const response = await fetch(PUBLIC_API_BASE + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  return response.json();
}
*/