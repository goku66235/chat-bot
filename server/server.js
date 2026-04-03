import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ✅ FIX __dirname (VERY IMPORTANT)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 🔐 API KEY (put yours)
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
    console.error(error);
    res.json({
      reply: "Error: API not working or quota finished",
    });
  }
});


// ✅ 🔥 SERVE FRONTEND (THIS WAS BREAKING)
app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});