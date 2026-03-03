import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [prevPrompt, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);

  const onsent = async (prompt) => {
    const finalPrompt = prompt || input;

    if (!finalPrompt?.trim()) return;

    setShowResult(true);
    setLoading(true);

    // Add user message
    setResultData((prev) => [
      ...prev,
      { type: "user", text: finalPrompt },
    ]);

    setPrevPrompts((prev) => [...prev, finalPrompt]);

    try {
      // 🔥 Call your backend instead of gemini.js
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: finalPrompt }),
        }
      );

      const data = await response.json();

      // Add AI response
      setResultData((prev) => [
        ...prev,
        { type: "ai", text: data.reply },
      ]);
    } catch (err) {
      setResultData((prev) => [
        ...prev,
        { type: "ai", text: "❌ Error getting response" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const resetChat = () => {
    setInput("");
    setResultData([]);
    setShowResult(false);
    setPrevPrompts([]);
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        resultData,
        showResult,
        prevPrompt,
        onsent,
        resetChat,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
export { Context };