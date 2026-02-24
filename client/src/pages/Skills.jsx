import { useState } from "react";

export default function Skills() {
  const [activeTab, setActiveTab] = useState("languages");

  const renderProgress = (name, level) => (
    <div className="skill" key={name}>
      <span>{name}</span>
      <div className="progress">
        <div className="bar" style={{ width: level, "--level": level }}>
          {level}
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <h2>Skills</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "languages" ? "active" : ""}`}
          onClick={() => setActiveTab("languages")}
        >
          Programming Languages
        </button>
        <button
          className={`tab-button ${activeTab === "frameworks" ? "active" : ""}`}
          onClick={() => setActiveTab("frameworks")}
        >
          Frameworks
        </button>
        <button
          className={`tab-button ${activeTab === "tools" ? "active" : ""}`}
          onClick={() => setActiveTab("tools")}
        >
          Tools
        </button>
      </div>

      <div
        className="tab-content"
        style={{ display: activeTab === "languages" ? "block" : "none" }}
      >
        {renderProgress("HTML", "80%")}
        {renderProgress("CSS", "85%")}
        {renderProgress("JavaScript", "75%")}
        {renderProgress("Python", "80%")}
        {renderProgress("Java", "70%")}
        {renderProgress("C#", "70%")}
      </div>

      <div
        className="tab-content"
        style={{ display: activeTab === "frameworks" ? "block" : "none" }}
      >
        {renderProgress("React", "15%")}
        {renderProgress("Node.js", "70%")}
      </div>

      <div
        className="tab-content"
        style={{ display: activeTab === "tools" ? "block" : "none" }}
      >
        {renderProgress("Git", "80%")}
        {renderProgress("VS Code", "99%")}
      </div>
    </section>
  );
}
