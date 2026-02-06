const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const formTitle = document.getElementById("formTitle");
const form = document.getElementById("eventForm");
const message = document.getElementById("formMessage");

const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const activitySelect = document.getElementById("activityId");
const locationInput = document.getElementById("location");
const difficultySelect = document.getElementById("difficulty");
const distanceInput = document.getElementById("distanceKm");

if (eventId) formTitle.textContent = "Edit Event";

async function loadActivities() {
  const activities = await apiFetch("/activities");
 // const activities = await apiFetchPublic("/activities");

  activities.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.name;
    activitySelect.appendChild(opt);
  });
}

async function loadEvent() {
  if (!eventId) return;
  const events = await apiFetch("/events");
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  titleInput.value = event.title;
  descInput.value = event.description;
  activitySelect.value = event.activityId;

  if (locationInput) locationInput.value = event.location || "";
  if (difficultySelect) difficultySelect.value = event.difficulty || "";
  if (distanceInput) distanceInput.value = event.distanceKm || "";
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: titleInput.value,
    description: descInput.value,
    activityId: activitySelect.value,
    location: locationInput?.value.trim() || null,
    difficulty: difficultySelect?.value || null,
    distanceKm: distanceInput?.value.trim() || null
  };

  const method = eventId ? "PATCH" : "POST";
  const endpoint = eventId ? `/events/${eventId}` : "/events";

  await apiFetch(endpoint, {
    method,
    body: JSON.stringify(payload)
  });

  message.textContent = "Event saved successfully.";
  setTimeout(() => window.location.href = "events.html", 800);
};

loadActivities().then(loadEvent);
