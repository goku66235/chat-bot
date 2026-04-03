import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

// ✅ Allow frontend (Netlify) to access backend
app.use(cors({
  origin: "*", // later you can restrict to your Netlify URL
}));

app.use(express.json());

// 🔐 Gemini setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧠 API Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "❌ Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("🔥 Backend Error:", error);

    // ✅ Friendly message for quota/billing issue
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

// ✅ Health check (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Use Render port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});