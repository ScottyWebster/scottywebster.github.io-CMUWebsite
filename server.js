import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to parse JSON
app.use(express.json());

// 1. Serve static files from the dist folder
app.use(express.static(path.join(__dirname, "client", "dist")));

// Global chat history for the session
let chatHistory = [
  {
    role: "system",
    content:
      "You represent Scott Webster. Scott is looking for a computer science internship. He knows Java, Python, HTML, CSS, and JS. His featured project is an interactive Warhammer Fantasy Map. Answer questions as if you are Scott's enthusiastic agent. He goes to school at Kean University in New Jersey and is looking for an internship. His contact information is webster.j.scott@gmail.com",
  },
];

// 2. API Routes (MUST be defined before the wildcard)
app.post("/api/generate", (req, res) => {
  const endpoint = req.query.endpoint;

  if (endpoint === "chat") {
    chatHistory.push({ role: "user", content: req.body.message });
    res.status(200).json({ success: true });
  } else if (endpoint === "reset") {
    chatHistory = [
      {
        role: "system",
        content:
          "You represent Scott Webster. Scott is looking for a software engineering internship. He knows Java, Python, HTML, CSS, and JS. His featured project is an interactive Warhammer Fantasy Map. Answer questions as if you are Scott's enthusiastic agent.",
      },
    ];
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: "Endpoint not found" });
  }
});

// SSE stream for the chat
app.get("/api/generate", async (req, res) => {
  if (req.query.endpoint === "stream") {
    // These headers ensure the browser treats this as a stream, not HTML
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        stream: true,
      });

      for await (const chunk of stream) {
        const message = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      }
      res.end();
    } catch (error) {
      console.error(error);
      res.write(
        `event: error\ndata: ${JSON.stringify({ message: "Stream error" })}\n\n`,
      );
      res.end();
    }
  } else {
    res.status(404).json({ error: "Endpoint not found" });
  }
});

// 3. Catch-all Route (MUST be last)
// This handles client-side routing and serves the index.html for unknown routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
