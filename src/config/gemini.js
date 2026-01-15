const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const BASE_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export const main = async (prompt) => {
  if (!prompt) return "No prompt provided.";

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response"
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    return "❌ Error generating response";
  }
};
