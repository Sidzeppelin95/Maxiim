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
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (!button || !menu) return;

    const closeMenu = () => {
      dropdown.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      dropdown.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        document.querySelectorAll(".dropdown.open").forEach((d) => {
          d.classList.remove("open");
          d.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
        openMenu();
      }
    });

    button.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
        button.focus();
      }
    });

    menu.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", () => closeMenu());
      item.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeMenu();
          button.focus();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        closeMenu();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initializePageInteractions);
