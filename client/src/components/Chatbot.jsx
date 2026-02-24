import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; // Make sure to create this CSS file for styling

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // 1. Add user message to UI and clear input
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      // 2. Send the POST request to the backend to register the message
      const response = await fetch("/api/generate?endpoint=chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (data.success) {
        // 3. Add an empty assistant message block to the UI
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        // 4. Open the Server-Sent Events (SSE) stream
        const eventSource = new EventSource("/api/generate?endpoint=stream");

        eventSource.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);

          // Update the very last message in the array with the new chunks
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + parsedData,
            };
            return newMessages;
          });
        };

        // Close the stream when the backend finishes sending data
        eventSource.onerror = () => {
          eventSource.close();
        };
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    try {
      await fetch("/api/generate?endpoint=reset", { method: "POST" });
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  return (
    <div id="chatbot-widget" className={isOpen ? "" : "chatbot-hidden"}>
      <div
        id="chatbot-header"
        onClick={toggleChat}
        style={{ cursor: "pointer" }}
      >
        <h3>AI Assistant</h3>
        <span id="chatbot-toggle-icon">💬</span>
      </div>

      <div id="chatbot-body">
        <div
          id="chat-messages"
          style={{ overflowY: "auto", maxHeight: "300px" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form id="chat-form" onSubmit={sendMessage}>
          <input
            type="text"
            id="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit">Send</button>
          <button type="button" id="chat-clear" onClick={clearChat}>
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}
