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
}

document.addEventListener("DOMContentLoaded", initializePageInteractions);

// ===============================
// VIDEO MODAL (SAFE INITIALIZATION)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("explore-video-btn");
  const modal = document.getElementById("video-modal");
  const closeBtn = document.getElementById("video-close");
  const video = document.getElementById("platform-video");

  // Exit safely if elements don't exist (prevents errors on other pages)
  if (!exploreBtn || !modal || !closeBtn || !video) return;

  // OPEN MODAL
  exploreBtn.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    video.currentTime = 0;
    video.play().catch(() => {
      // autoplay may be blocked; controls will still work
    });
  });

  // CLOSE BUTTON
  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  // CLICK OUTSIDE VIDEO
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC KEY SUPPORT
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    video.pause();
  }
});
