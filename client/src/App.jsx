import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

// Import all pages
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Dino from "./pages/Dino";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/dino" element={<Dino />} />
      </Routes>

      <Chatbot />
    </div>
  );
}
