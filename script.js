document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((tab) => tab.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let hasError = false;
      document
        .querySelectorAll(".error")
        .forEach((el) => (el.textContent = ""));

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        document.getElementById("nameError").textContent = "Name is required.";
        hasError = true;
      }

      if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent =
          "Enter a valid email.";
        hasError = true;
      }

      if (!message) {
        document.getElementById("messageError").textContent =
          "Message cannot be empty.";
        hasError = true;
      }

      const success = document.getElementById("formSuccess");
      if (!hasError) {
        success.classList.remove("hidden");
        form.reset();
      } else {
        success.classList.add("hidden");
      }
    });
  }

  if (modal) {
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-description");
    const modalImg = document.getElementById("carousel-img");
    const indicatorContainer = document.getElementById("carousel-indicators");

    let currentSlide = 0;
    let images = [];

    function updateCarousel() {
      modalImg.src = images[currentSlide];
      indicatorContainer.innerHTML = "";
      images.forEach((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (idx === currentSlide ? " active" : "");
        indicatorContainer.appendChild(dot);
      });
    }

    function openModal(button) {
      let title = button.dataset.title;
      let desc = button.dataset.description;
      let imgs = button.dataset.images;

      if (!title || !desc || !imgs) {
        const card = button.closest(".project-card");
        if (card) {
          title = card.dataset.title;
          desc = card.dataset.description;
          imgs = card.dataset.images;
        }
      }

      if (!title || !desc || !imgs) return; // safety check

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      images = JSON.parse(imgs);
      currentSlide = 0;
      updateCarousel();
      modal.classList.remove("hidden");
    }

    function closeModal() {
      modal.classList.add("hidden");
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % images.length;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + images.length) % images.length;
      updateCarousel();
    }

    document.querySelectorAll(".view-details-btn").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn));
    });

    document.querySelector(".close").addEventListener("click", closeModal);

    const prevBtn = document.querySelector(
      ".carousel-controls button:first-child"
    );
    const nextBtn = document.querySelector(
      ".carousel-controls button:last-child"
    );

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", prevSlide);
      nextBtn.addEventListener("click", nextSlide);
    }
  }

  // Dark mode toggle — safe to run on all pages
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "🌙";
    }

    toggleBtn.addEventListener("click", () => {
      const darkModeEnabled = document.body.classList.toggle("dark-mode");
      toggleBtn.textContent = darkModeEnabled ? "🌙" : "☀️";
      localStorage.setItem(
        "darkMode",
        darkModeEnabled ? "enabled" : "disabled"
      );
    });
  }

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#") && !href.startsWith("http")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      });
    }
  });
});
