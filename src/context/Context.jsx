import { createContext, useState } from "react";
import { main } from "../config/gemini";

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

    // User message
    setResultData((prev) => [
      ...prev,
      { type: "user", text: finalPrompt },
    ]);

    setPrevPrompts((prev) => [...prev, finalPrompt]);

    try {
      const reply = await main(finalPrompt);

      // AI message
      setResultData((prev) => [
        ...prev,
        { type: "ai", text: reply },
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
