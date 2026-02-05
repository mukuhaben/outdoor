const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

const table = document.getElementById("pricingTable");
const form = document.getElementById("pricingForm");

if (!eventId) {
  alert("Missing event");
  window.location.href = "events.html";
}

function goBack() {
  window.location.href = "events.html";
}

async function loadPricing() {
  table.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;
  const pricing = await apiFetch(`/events/${eventId}/pricing`);

  if (!pricing || pricing.length === 0) {
    table.innerHTML = `<tr><td colspan="4">No pricing set.</td></tr>`;
    return;
  }

  table.innerHTML = "";

  pricing.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.label}</td>
      <td>${p.amount}</td>
      <td>${p.isActive ? "Active" : "Inactive"}</td>
      <td>
        <button onclick="togglePricing('${p.id}', ${p.isActive})">
          ${p.isActive ? "Disable" : "Enable"}
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();

  const payload = {
    label: document.getElementById("label").value,
    amount: Number(document.getElementById("amount").value),
    currency: "KES"
  };

  await apiFetch(`/events/${eventId}/pricing`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  form.reset();
  loadPricing();
};

async function togglePricing(id, isActive) {
  await apiFetch(`/pricing/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive: !isActive })
  });
  loadPricing();
}

loadPricing();
