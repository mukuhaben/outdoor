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
