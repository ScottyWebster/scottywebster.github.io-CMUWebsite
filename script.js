const modal = document.getElementById("modal");
let currentSlide = 0;
const images = ["images/img1.jpg", "images/img2.png", "images/img3.jpg"]; // Replace with real paths

function openModal() {
  modal.classList.remove("hidden");
  updateCarousel();
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

function updateCarousel() {
  document.getElementById("carousel-img").src = images[currentSlide];
  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlide);
  });
}
