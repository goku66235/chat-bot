import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Fix __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ CORS (not really needed now, but safe)
app.use(cors());
app.use(express.json());

// 🔐 Check API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
}

// 🔐 Gemini setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧠 Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "❌ Message is required",
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = result.text;

    res.json({ reply });

  } catch (error) {
    console.error("🔥 Backend Error:", error);

    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return res.status(503).json({
        reply:
          "😂 Backend ke paas billing ka paisa nahi hai. Try again later.",
      });
    }

    res.status(500).json({
      reply: "❌ Server error. Please try again.",
    });
  }
});


// ✅ 🔥 SERVE REACT BUILD (IMPORTANT)

// 1. Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// 2. Handle all frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});