// =========================
// BOOKING POPUP
// =========================
const bookBtn = document.getElementById("bookAdventureBtn");
const heroBookBtn = document.getElementById("heroBookBtn");
const mobileBookBtn = document.getElementById("mobileBookBtn");
const popup = document.getElementById("bookingPopup");
const closePopup = document.getElementById("closePopup");

// =========================
// HAMBURGER MENU
// =========================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");
const mobileLinks = document.querySelectorAll(".mobile-link");
const mobileCloseBtn = document.querySelector(".mobile-close");

function openMenu() {
  mobileMenu.classList.add("open");
  overlay.classList.add("show");
  hamburger.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  overlay.classList.remove("show");
  hamburger.classList.remove("active");
  document.body.style.overflow = "";
}

// Toggle menu
hamburger.addEventListener("click", () => {
  mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
});

// Close via X button
if (mobileCloseBtn) {
  mobileCloseBtn.addEventListener("click", closeMenu);
}

// Close when any standard mobile link is clicked
mobileLinks.forEach(link => {
  link.addEventListener("click", closeMenu);
});

// =========================
// MOBILE ACTIVITIES DROPDOWN
// =========================
const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");
const mobileDropdownMenu = document.querySelector(".mobile-dropdown-menu");

if (mobileDropdownToggle && mobileDropdownMenu) {
  mobileDropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileDropdownMenu.classList.toggle("open");
  });
}

// Close hamburger when Activities link is clicked
const mobileActivitiesLink = document.querySelector(".mobile-dropdown-link");

if (mobileActivitiesLink) {
  mobileActivitiesLink.addEventListener("click", () => {
    closeMenu();
  });
}

// =========================
// BOOKING POPUP LOGIC
// =========================
[bookBtn, heroBookBtn, mobileBookBtn].forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      popup.style.display = "flex";
      closeMenu();
    });
  }
});

if (closePopup) {
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });
}

// =========================
// SWIPE TO CLOSE (MOBILE)
// =========================
let startX = 0;
let currentX = 0;

mobileMenu.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

mobileMenu.addEventListener("touchmove", (e) => {
  currentX = e.touches[0].clientX;
});

mobileMenu.addEventListener("touchend", () => {
  if (currentX - startX > 80) {
    closeMenu();
  }
  startX = 0;
  currentX = 0;
});
