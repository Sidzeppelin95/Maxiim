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

  const dropdowns = Array.from(document.querySelectorAll(".dropdown"));

  const closeDropdown = (dropdown, shouldFocusToggle = false) => {
    dropdown.classList.remove("open");
    const toggle = dropdown.querySelector(".dropdown-toggle");
    toggle?.setAttribute("aria-expanded", "false");

    if (shouldFocusToggle && toggle) {
      toggle.focus();
    }
  };

  const closeAllDropdowns = () => {
    dropdowns.forEach(closeDropdown);
  };

  const focusMenuItem = (items, index) => {
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  };

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (!button || !menu) return;

    const getItems = () => Array.from(menu.querySelectorAll('a[role="menuitem"]'));

    const openDropdown = () => {
      closeAllDropdowns();
      dropdown.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      if (isOpen) {
        closeDropdown(dropdown);
      } else {
        openDropdown();
      }
    });

    button.addEventListener("keydown", (e) => {
      const items = getItems();
      if (e.key === "Escape") {
        closeDropdown(dropdown);
        button.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown();
        focusMenuItem(items, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        openDropdown();
        focusMenuItem(items, items.length - 1);
      }
    });

    getItems().forEach((item, index) => {
      item.addEventListener("click", () => closeDropdown(dropdown));
      item.addEventListener("keydown", (e) => {
        const items = getItems();
        if (e.key === "Escape") {
          e.preventDefault();
          closeDropdown(dropdown);
          button.focus();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          focusMenuItem(items, index + 1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          focusMenuItem(items, index - 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          focusMenuItem(items, 0);
        } else if (e.key === "End") {
          e.preventDefault();
          focusMenuItem(items, items.length - 1);
        } else if (e.key === "Tab") {
          e.preventDefault();
          closeDropdown(dropdown, true);
        }
      });
    });
  });

  // Single delegated outside-click handler.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((dropdown) => {
        const isOpen = dropdown.classList.contains("open");
        if (!isOpen) return;

        const activeInsideDropdown = dropdown.contains(document.activeElement);
        closeDropdown(dropdown, activeInsideDropdown);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", initializePageInteractions);
