const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

const form = document.getElementById("imageForm");
const input = document.getElementById("imageInput");
const grid = document.getElementById("imageGrid");

if (!eventId) {
  alert("Missing event");
  window.location.href = "events.html";
}

function goBack() {
  window.location.href = "events.html";
}

async function loadImages() {
  grid.innerHTML = "Loading images...";
  const images = await apiFetch(`/events/${eventId}/images`);

  if (!images || images.length === 0) {
    grid.innerHTML = "No images uploaded.";
    return;
  }

  grid.innerHTML = "";
  images.forEach(img => {
    const el = document.createElement("img");
    el.src = img.url;
    el.style.width = "150px";
    el.style.borderRadius = "6px";
    grid.appendChild(el);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const file = input.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("image", file); // MUST be 'image'

  await fetch(`/api/admin/events/${eventId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    },
    body: fd
  });

  input.value = "";
  loadImages();
};

loadImages();
