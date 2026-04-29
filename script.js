function initializePageInteractions() {
  // Smooth scroll for in-page anchors only.
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function onNavClick(e) {
      const targetHref = this.getAttribute("href") || "";

      if (!targetHref.startsWith("#") || targetHref.length <= 1) {
        return;
      }

      const target = document.querySelector(targetHref);
      if (!target) {
        return;
      }

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Accessible dropdown toggle behavior.
  const dropdowns = Array.from(document.querySelectorAll(".dropdown"));

  const closeDropdown = (dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  };

  const closeAllDropdowns = () => {
    dropdowns.forEach(closeDropdown);
  };

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (!button || !menu) return;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      closeAllDropdowns();

      if (!isOpen) {
        dropdown.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });

    button.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDropdown(dropdown);
        button.focus();
      }
    });

    menu.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", () => closeDropdown(dropdown));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeDropdown(dropdown);
          button.focus();
        }
      });
    });
  });

  // Single delegated outside-click handler.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      closeAllDropdowns();
    }
  });

document.addEventListener("DOMContentLoaded", initializePageInteractions);
  // ===============================
// VIDEO PLAYLIST LOGIC
// ===============================

const btn = document.getElementById("explore-video-btn");
const modal = document.getElementById("video-modal");
const closeBtn = document.getElementById("video-close");
const nextBtn = document.getElementById("video-next");
const video = document.getElementById("platform-video");

if (!btn) return;

if (!modal || !closeBtn || !video || !nextBtn) {
  console.warn("Video playlist not initialized properly.");
  return;
}

// 🎬 VIDEO LIST (ADD YOUR FILES HERE)
const playlist = [
  "video.mp4",
  "video2.mp4",
  "video3.mp4"
];

let currentIndex = 0;

// LOAD VIDEO FUNCTION
function loadVideo(index) {
  currentIndex = index % playlist.length;

  video.src = playlist[currentIndex];
  video.load();

  video.play().catch((err) => {
    console.warn("Playback issue:", err);
  });
}

// OPEN PLAYER
btn.addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  loadVideo(0);
});

// NEXT BUTTON
nextBtn.addEventListener("click", () => {
  loadVideo(currentIndex + 1);
});

// AUTO-PLAY NEXT WHEN VIDEO ENDS
video.addEventListener("ended", () => {
  loadVideo(currentIndex + 1);
});

// CLOSE PLAYER
closeBtn.addEventListener("click", () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  video.pause();
});
