// ===============================
// Schedule Management (Admin)
// ===============================

let editingId = null; // track edit mode

const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

const table = document.getElementById("scheduleTable");
const form = document.getElementById("scheduleForm");
const submitBtn = form.querySelector("button");

if (!eventId) {
  alert("Missing event");
  window.location.href = "events.html";
}

function goBack() {
  window.location.href = "events.html";
}

// -------------------------------
// Load schedules
// -------------------------------
async function loadSchedules() {
  table.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  const schedules = await apiFetch(`/events/${eventId}/schedules`);

  if (!schedules || schedules.length === 0) {
    table.innerHTML = `<tr><td colspan="4">No schedules.</td></tr>`;
    return;
  }

  table.innerHTML = "";

  schedules.forEach(s => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${new Date(s.date).toLocaleDateString()}</td>
      <td>${s.duration || "—"}</td>
      <td>${s.status}</td>
      <td>
        <button onclick="editSchedule(
          '${s.id}',
          '${s.date}',
          '${s.duration || ""}'
        )">Edit</button>

        <button onclick="setStatus('${s.id}','UPCOMING')">UPCOMING</button>
        <button onclick="setStatus('${s.id}','FULL')">FULL</button>
        <button onclick="setStatus('${s.id}','CANCELLED')">CANCEL</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// -------------------------------
// Edit schedule (populate form)
// -------------------------------
function editSchedule(id, date, duration) {
  editingId = id;

  document.getElementById("date").value =
    new Date(date).toISOString().split("T")[0];

  document.getElementById("duration").value = duration;

  submitBtn.textContent = "Save Changes";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -------------------------------
// Reset form after save
// -------------------------------
function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add Schedule";
}

// -------------------------------
// Create / Update schedule
// -------------------------------
form.onsubmit = async (e) => {
  e.preventDefault();

  const payload = {
    date: document.getElementById("date").value,
    duration: document.getElementById("duration").value // STRING ✔
  };

  if (!payload.date || !payload.duration) {
    alert("Date and duration are required");
    return;
  }

  if (editingId) {
    // UPDATE
    await apiFetch(`/schedules/${editingId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  } else {
    // CREATE
    await apiFetch(`/events/${eventId}/schedules`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  resetForm();
  loadSchedules();
};

// -------------------------------
// Update schedule status
// -------------------------------
async function setStatus(id, status) {
  await apiFetch(`/schedules/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

  loadSchedules();
}

// Init
loadSchedules();
