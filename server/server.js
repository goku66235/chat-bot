import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

// ✅ CORS (allow frontend)
app.use(
  cors({
    origin: "*", // later replace with your Netlify URL
  })
);

app.use(express.json());

// 🔐 Check API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables");
}

// 🔐 Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧠 Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "❌ Message is required",
      });
    }

    // 🤖 Generate response
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", // you can switch to 2.0 if quota issues
      contents: message,
    });

    // ✅ Correct response extraction
    const reply = result.text;

    res.json({ reply });

  } catch (error) {
    console.error("🔥 Backend Error:", error);

    // ❌ Quota / billing issue
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

    // ❌ Other errors
    res.status(500).json({
      reply: "❌ Server error. Please try again.",
    });
  }
});

// ✅ Health check (important for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});