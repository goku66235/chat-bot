import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// 🔐 Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "❌ Message is required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("🔥 Backend Error:", error);

    // ✅ Handle billing / quota errors
    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return res.status(503).json({
        reply:
          "😂 Backend ke paas billing ka paisa nahi hai. AI service unavailable (quota exceeded).",
      });
    }

    // Other errors
    res.status(500).json({
      reply: "❌ Backend error occurred. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});