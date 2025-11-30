import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDSvwTeEVilz8Sz-slDYEgMjNmigUy9A30",
});

export async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error generating response.";
  }
}
