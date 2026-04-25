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
