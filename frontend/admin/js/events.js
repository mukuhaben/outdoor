const tableBody = document.getElementById("eventsTableBody");
const createBtn = document.getElementById("createEventBtn");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
};

createBtn.onclick = () => {
  window.location.href = "event-form.html";
};

async function loadEvents() {
  tableBody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  const events = await apiFetch("/events");

  if (!events || events.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No events found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

  events.forEach(event => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.title}</td>
      <td>${event.activity?.name || "—"}</td>
      <td class="${event.isActive ? "status-published" : "status-draft"}">
        ${event.isActive ? "Published" : "Draft"}
      </td>
      <td class="actions">
        <button onclick="editEvent('${event.id}')">Edit</button>
        <button onclick="togglePublish('${event.id}', ${event.isActive})">
          ${event.isActive ? "Unpublish" : "Publish"}
        </button>
        <button onclick="managePricing('${event.id}')">Pricing</button>
        <button onclick="manageSchedules('${event.id}')">Schedules</button>
        <button onclick="manageImages('${event.id}')">Images</button>
        <button onclick="deleteEvent('${event.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function editEvent(id) {
  window.location.href = `event-form.html?id=${id}`;
}

function managePricing(id) {
  window.location.href = `pricing.html?eventId=${id}`;
}

function manageSchedules(id) {
  window.location.href = `schedules.html?eventId=${id}`;
}

function manageImages(id) {
  window.location.href = `images.html?eventId=${id}`;
}

async function togglePublish(id, isActive) {
  const endpoint = isActive
    ? `/events/${id}/unpublish`
    : `/events/${id}/publish`;

  try {
    await apiFetch(endpoint, { method: "PATCH" });
    await loadEvents(); // make sure to await refresh
  } catch (err) {
    console.error("Failed to toggle publish:", err);
  }
}



async function deleteEvent(id) {
  if (!confirm("Delete this event? This cannot be undone.")) return;
  await apiFetch(`/events/${id}`, { method: "DELETE" });
  loadEvents();
}

loadEvents();
