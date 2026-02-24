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
      ".carousel-controls button:first-child",
    );
    const nextBtn = document.querySelector(
      ".carousel-controls button:last-child",
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
        darkModeEnabled ? "enabled" : "disabled",
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
      image: "images/t-shirt.jpg",
      price: 19,
      category: "Clothing",
    },
    {
      name: "Headphones",
      image: "images/headphones.jpg",
      price: 199,
      category: "Electronics",
    },
    {
      name: "Blender",
      image: "images/blender.jpg",
      price: 59,
      category: "Home",
    },
    {
      name: "Sofa",
      image: "images/sofa.jpg",
      price: 399,
      category: "Home",
    },
    {
      name: "Jacket",
      image: "images/jacket.jpg",
      price: 89,
      category: "Clothing",
    },
    {
      name: "Microwave",
      image: "images/microwave.jpg",
      price: 120,
      category: "Home",
    },
  ];

  const gallery = document.getElementById("productGallery");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const categoryCheckboxes = document.querySelectorAll(".category-filter");

  function renderProducts() {
    if (!gallery) {
      return;
    }
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const sortValue = sortSelect ? sortSelect.value : "";
    const selectedCategories = categoryCheckboxes
      ? Array.from(categoryCheckboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value)
      : [];

    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) &&
        selectedCategories.includes(p.category),
    );

    // Sort logic
    if (sortValue === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc") filtered.sort((a, b) => b.price - a.price);
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
        '<span class="highlight">$1</span>',
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

  if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }

  if (categoryCheckboxes.length > 0) {
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", renderProducts),
    );
  }

  renderProducts();

  // --- Global Chatbot Implementation ---

  const chatbotHTML = `
    <div id="chatbot-widget" class="chatbot-hidden">
      <div id="chatbot-header">
        <h3>AI Assistant</h3>
        <span id="chatbot-toggle-icon">💬</span>
      </div>
      <div id="chatbot-body">
        <div id="chat-messages"></div>
        <form id="chat-form">
          <input type="text" id="chat-input" placeholder="Type a message..." required autocomplete="off" />
          <button type="submit">Send</button>
          <button type="button" id="chat-clear">Clear</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  let chatHistory = [
    { role: "system", content: "You are a helpful assistant." },
  ];

  const widget = document.getElementById("chatbot-widget");
  const header = document.getElementById("chatbot-header");
  const messagesContainer = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const clearBtn = document.getElementById("chat-clear");

  header.addEventListener("click", () => {
    widget.classList.toggle("chatbot-hidden");
  });

  function appendMessage(role, content) {
    if (role === "system") return;
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.textContent = content;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = "";

    chatHistory.push({ role: "user", content: text });
    appendMessage("user", text);

    try {
      // Notice: Only using a relative path now because the frontend and backend share a server
      const response = await fetch("/api/generate?endpoint=chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (data.success) {
        const eventSource = new EventSource("/api/generate?endpoint=stream");

        eventSource.onmessage = function (event) {
          const parsedData = JSON.parse(event.data);
          const lastIndex = chatHistory.length - 1;

          if (
            chatHistory.length > 0 &&
            chatHistory[lastIndex].role === "assistant"
          ) {
            chatHistory[lastIndex].content += parsedData;
            const messageNodes = messagesContainer.querySelectorAll(".message");
            if (messageNodes.length > 0) {
              messageNodes[messageNodes.length - 1].textContent =
                chatHistory[lastIndex].content;
            }
          } else {
            chatHistory.push({ role: "assistant", content: parsedData });
            appendMessage("assistant", parsedData);
          }
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        eventSource.onerror = function () {
          eventSource.close();
        };
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  });

  clearBtn.addEventListener("click", async () => {
    chatHistory = [{ role: "system", content: "You are a helpful assistant." }];
    messagesContainer.innerHTML = "";
    try {
      await fetch("/api/generate?endpoint=reset", { method: "POST" });
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  });
});
