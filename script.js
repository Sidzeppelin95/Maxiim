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
  // ===============================
  // VIDEO OVERLAY (FLOATING PLAYER)
  // ===============================

  const btn = document.getElementById("explore-video-btn");
  const modal = document.getElementById("video-modal");
  const closeBtn = document.getElementById("video-close");
  const nextBtn = document.getElementById("video-next");
  const video = document.getElementById("platform-video");
  const title = document.getElementById("video-title");
  const counter = document.getElementById("video-counter");
  const source = video?.querySelector("source");

  if (!btn || !modal || !closeBtn || !nextBtn || !video || !source) {
    return;
  }

  const parseVideoList = (attributeName, fallback) => {
    try {
      const parsed = JSON.parse(video.dataset[attributeName] || "[]");
      return Array.isArray(parsed) && parsed.length ? parsed : fallback;
    } catch (error) {
      console.warn(`Invalid video ${attributeName} data.`, error);
      return fallback;
    }
  };

  const playlist = parseVideoList("playlist", [source.getAttribute("src")]);
  const titles = parseVideoList("titles", playlist.map((_, index) => `Platform video ${index + 1}`));
  let currentVideoIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  const updateVideoDetails = () => {
    if (title) {
      title.textContent = titles[currentVideoIndex] || `Platform video ${currentVideoIndex + 1}`;
    }

    if (counter) {
      counter.textContent = `Video ${currentVideoIndex + 1} of ${playlist.length}`;
    }
  };

  const playCurrentVideo = ({ reset = false } = {}) => {
    const selectedVideo = playlist[currentVideoIndex];

    if (source.getAttribute("src") !== selectedVideo) {
      source.setAttribute("src", selectedVideo);
      video.load();
    }

    if (reset) {
      video.currentTime = 0;
    }

    updateVideoDetails();

    if (modal.classList.contains("open")) {
      video.play().catch(() => {
        console.warn("Autoplay blocked by browser. Use the video controls to start playback.");
      });
    }
  };

  const playNextVideo = () => {
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    playCurrentVideo({ reset: true });
  };

  const closeVideoModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    video.pause();
    document.removeEventListener("keydown", handleKeydown);
  };

  const handleKeydown = (event) => {
    if (!modal.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape" || event.key === "Esc") {
      closeVideoModal();
      btn.focus();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      playNextVideo();
    }
  };

  btn.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    currentVideoIndex = 0;
    playCurrentVideo({ reset: true });
    document.addEventListener("keydown", handleKeydown);
    closeBtn.focus();
  });

  closeBtn.addEventListener("click", closeVideoModal);
  nextBtn.addEventListener("click", playNextVideo);
  video.addEventListener("ended", playNextVideo);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeVideoModal();
    }
  });

  modal.addEventListener("touchstart", (event) => {
    if (event.target.closest("button") || event.target.closest("video")) {
      return;
    }

    const [touch] = event.changedTouches;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  modal.addEventListener("touchend", (event) => {
    if (event.target.closest("button") || event.target.closest("video")) {
      return;
    }

    const [touch] = event.changedTouches;
    const xDiff = touch.clientX - touchStartX;
    const yDiff = touch.clientY - touchStartY;
    const elapsed = Date.now() - touchStartTime;
    const isHorizontalSwipe = Math.abs(xDiff) > 45 && Math.abs(xDiff) > Math.abs(yDiff);
    const isSimpleTap = Math.abs(xDiff) < 12 && Math.abs(yDiff) < 12 && elapsed < 350;

    if (isHorizontalSwipe || isSimpleTap) {
      playNextVideo();
    }
  }, { passive: true });

  updateVideoDetails();
}

document.addEventListener("DOMContentLoaded", initializePageInteractions);
