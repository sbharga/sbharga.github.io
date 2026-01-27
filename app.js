// Theme flash prevention - MUST execute immediately
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  // If no saved theme, CSS will use prefers-color-scheme
})();

// DOM-dependent features - waits for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();

  // Page-specific features (feature detection)
  if (document.querySelector('.hamburger')) {
    initHamburgerMenu();
  }

  if (document.querySelector('.timeline-button')) {
    initModals();
  }

  if (document.getElementById('back-to-top')) {
    initBackToTop();
  }
});

// Theme toggle functionality (shared by index.html and 404.html)
function initThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Get effective theme (considering system preference)
  function getEffectiveTheme() {
    const savedTheme = html.getAttribute("data-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  toggleButton.addEventListener("click", () => {
    const currentTheme = getEffectiveTheme();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem("theme")) {
      // CSS handles this via prefers-color-scheme, but we ensure no data-theme is set
      html.removeAttribute("data-theme");
    }
  });
}

// Hamburger menu toggle (index.html only)
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active"));
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.focus();
    }
  });

  // Close menu on window resize (when switching to desktop view)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

// Modal functionality (index.html only)
function initModals() {
  const timelineButtons = document.querySelectorAll(".timeline-button");
  const modals = document.querySelectorAll(".modal");
  const modalCloses = document.querySelectorAll(".modal-close");
  const modalOverlays = document.querySelectorAll(".modal-overlay");

  // Open modal
  timelineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button
        .closest(".timeline-item")
        .getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal function
  const closeModal = (modal) => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Close modal on X button click
  modalCloses.forEach((close) => {
    close.addEventListener("click", () => {
      const modal = close.closest(".modal");
      closeModal(modal);
    });
  });

  // Close modal on overlay click
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      const modal = overlay.closest(".modal");
      closeModal(modal);
    });
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          closeModal(modal);
        }
      });
    }
  });
}

// Back to top button (index.html only)
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");
  let ticking = false;

  // Throttled scroll handler for better performance
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Scroll to top when clicked - respects reduced motion preference
  backToTopButton.addEventListener("click", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}
