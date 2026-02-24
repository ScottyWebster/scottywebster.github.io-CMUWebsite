import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to parse JSON and serve your HTML/CSS/JS files
app.use(express.json());
app.use(express.static(__dirname));

// Global chat history for the session
let chatHistory = [
  {
    role: "system",
    content:
      "You represent Scott Webster. Scott is looking for a software engineering internship. He knows Java, Python, HTML, CSS, and JS. His featured project is an interactive Warhammer Fantasy Map. Answer questions as if you are Scott's enthusiastic agent.",
  },
];

// POST route for sending messages and resetting history
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

// GET route for the Server-Sent Events (SSE) stream
app.get("/api/generate", async (req, res) => {
  if (req.query.endpoint === "stream") {
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
