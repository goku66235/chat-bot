import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);

  const onsent = async (prompt) => {
    const finalPrompt = prompt || input;
    if (!finalPrompt) return;

    setShowResult(true);
    setLoading(true);

    setResultData((prev) => [
      ...prev,
      { type: "user", text: finalPrompt },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalPrompt }),
      });

      const data = await response.json();

      setResultData((prev) => [
        ...prev,
        { type: "ai", text: data.reply },
      ]);

    } catch (err) {
      setResultData((prev) => [
        ...prev,
        { type: "ai", text: "Server error" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        resultData,
        showResult,
        onsent,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
export { Context };