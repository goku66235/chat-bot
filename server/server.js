import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// fix __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// 🔐 put your API key here
const ai = new GoogleGenAI({
  apiKey: "PASTE_YOUR_API_KEY_HERE",
});

// ✅ API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message is required" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.json({ reply: result.text });

  } catch (error) {
    console.log(error);
    res.json({
      reply: "Error: API not working or quota finished",
    });
  }
});

// ✅ Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Catch all routes (VERY IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});