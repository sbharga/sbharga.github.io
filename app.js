// Theme flash prevention - MUST execute immediately
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
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

  toggleButton.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    if (currentTheme === "light") {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

// Hamburger menu toggle (index.html only)
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
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

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  // Scroll to top when clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
