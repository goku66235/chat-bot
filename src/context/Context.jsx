import { createContext, useState } from "react";
import { main } from "../config/gemini"; // your AI API call

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [prevPrompt, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);

  const onsent = async (prompt) => {
    if (!prompt?.trim()) return;

    setShowResult(true);
    setLoading(true);

    setResultData((prev) => [...prev, { type: "user", text: prompt }]);
    setPrevPrompts((prev) => [...prev, prompt]);

    try {
      const reply = await main(prompt); // your API call

      // simulate typing effect line by line
      const lines = reply.split("\n");
      let typed = "";
      for (let i = 0; i < lines.length; i++) {
        typed += lines[i] + "\n";
      }
      setResultData((prev) => [...prev, { type: "ai", text: typed }]);
    } catch (err) {
      setResultData((prev) => [...prev, { type: "ai", text: "Error generating response." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const resetChat = () => {
    setInput("");
    setResultData([]);
    setShowResult(false);
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        resultData,
        setResultData,
        showResult,
        setShowResult,
        prevPrompt,
        setPrevPrompts,
        onsent,
        resetChat,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider; // ✅ default export
export { Context };
