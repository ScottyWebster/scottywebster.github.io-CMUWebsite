document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");

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
      const card = button.closest(".project-card");
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.description;
      images = JSON.parse(card.dataset.images);
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
