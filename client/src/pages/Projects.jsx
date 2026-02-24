import { useState } from "react";

export default function Projects() {
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    description: "",
    images: [],
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  const openModal = (title, description, images) => {
    setModalData({ isOpen: true, title, description, images });
    setCurrentSlide(0);
  };

  const closeModal = () => setModalData({ ...modalData, isOpen: false });

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % modalData.images.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + modalData.images.length) % modalData.images.length,
    );

  return (
    <>
      <section>
        <h2>Projects</h2>
        <div className="project-card">
          <h3>Interactive Warhammer Fantasy Map</h3>
          <button
            className="view-details-btn"
            onClick={() =>
              openModal(
                "Interactive Warhammer Fantasy Map",
                "Based off of the game Total War: Warhammer 3",
                ["/images/img1.jpg", "/images/img2.png", "/images/img3.jpg"],
              )
            }
          >
            View Details
          </button>
          <a href="https://scottywebster.github.io/">
            <button>Visit Project</button>
          </a>
        </div>

        <div className="project-card">
          <h3>Blank</h3>
          <button
            className="view-details-btn"
            onClick={() =>
              openModal("Blank", "Placeholder project", [
                "/images/img4.jpg",
                "/images/img5.jpg",
              ])
            }
          >
            View Details
          </button>
          <a href="example.com">
            <button>Visit Project</button>
          </a>
        </div>
      </section>

      <section>
        <h2>Project Timeline</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Interactive Warhammer Fantasy Map</h3>
              <span className="duration">Jan 2023 - Mar 2023</span>
              <p>A fantasy mapping tool inspired by Total War: Warhammer 3.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Blank</h3>
              <span className="duration">May 2023 - Jun 2023</span>
              <p>Placeholder for future project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* React Modal */}
      {modalData.isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>{modalData.title}</h3>
            <p>{modalData.description}</p>

            <div className="carousel">
              <img
                src={modalData.images[currentSlide]}
                alt="Project"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />
              <div className="carousel-controls">
                <button onClick={prevSlide}>&#10094;</button>
                <button onClick={nextSlide}>&#10095;</button>
              </div>
              <div className="indicators">
                {modalData.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentSlide ? "active" : ""}`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
