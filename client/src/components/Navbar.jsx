import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "enabled";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  }, [isDarkMode]);

  return (
    <nav>
      <ul>
        <li>|</li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>|</li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>|</li>
        <li>
          <Link to="/skills">Skills</Link>
        </li>
        <li>|</li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>|</li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>|</li>
        <li>
          <Link to="/dino">Dino Game</Link>
        </li>
        <li>|</li>
      </ul>
      <button id="darkModeToggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "🌙" : "☀️"}
      </button>
    </nav>
  );
}
