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

    // ✅ Add user message
    setResultData((prev) => [
      ...prev,
      { type: "user", text: finalPrompt },
    ]);

    setPrevPrompts((prev) => [...prev, finalPrompt]);

    try {
      // ✅ CALL BACKEND (same server - Render full stack)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalPrompt }),
      });

      // ✅ Handle HTTP errors
      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      // ✅ Add AI response
      setResultData((prev) => [
        ...prev,
        { type: "ai", text: data.reply },
      ]);

    } catch (err) {
      console.error("Frontend Error:", err);

      setResultData((prev) => [
        ...prev,
        {
          type: "ai",
          text: "❌ Failed to connect to server. Try again later.",
        },
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