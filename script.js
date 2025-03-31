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

  //Shop stuff

  const products = [
    {
      name: "Smartphone",
      image: "images/smartphone.jpg",
      price: 699,
      category: "Electronics",
    },
    {
      name: "Laptop",
      image: "images/laptop.jpg",
      price: 999,
      category: "Electronics",
    },
    {
      name: "Jeans",
      image: "images/jeans.jpg",
      price: 49,
      category: "Clothing",
    },
    {
      name: "T-shirt",
      image: "images/img4.jpg",
      price: 19,
      category: "Clothing",
    },
    {
      name: "Headphones",
      image: "images/img5.jpg",
      price: 199,
      category: "Electronics",
    },
    {
      name: "Blender",
      image: "images/img6.jpg",
      price: 59,
      category: "Home",
    },
    {
      name: "Sofa",
      image: "images/img7.jpg",
      price: 399,
      category: "Home",
    },
    {
      name: "Jacket",
      image: "images/img8.jpg",
      price: 89,
      category: "Clothing",
    },
    {
      name: "Microwave",
      image: "images/img9.jpg",
      price: 120,
      category: "Home",
    },
  ];

  const gallery = document.getElementById("productGallery");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categoryCheckboxes = document.querySelectorAll(".category-filter");

  function renderProducts() {
    const search = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) &&
        selectedCategories.includes(p.category)
    );

    // Sort logic
    if (sortValue === "price-asc")
      filtered.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    if (sortValue === "name-asc")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortValue === "name-desc")
      filtered.sort((a, b) => b.name.localeCompare(a.name));

    gallery.innerHTML = "";

    filtered.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      const regex = new RegExp(`(${search})`, "gi");
      const highlightedName = p.name.replace(
        regex,
        '<span class="highlight">$1</span>'
      );

      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${highlightedName}</h3>
        <p>Price: $${p.price}</p>
        <p>Category: ${p.category}</p>
      `;
      gallery.appendChild(card);
    });
  }

  searchInput.addEventListener("input", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  categoryCheckboxes.forEach((cb) =>
    cb.addEventListener("change", renderProducts)
  );

  renderProducts();
});
