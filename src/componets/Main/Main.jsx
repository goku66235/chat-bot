import React, { useContext, useRef, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { Context } from "../../context/Context";


// Example: inside Navbar.jsx or top of Main.jsx
const toggleSidebar = () => {
  document.querySelector('.sidebar').classList.toggle('active');
};

const Main = () => {
  const { onsent, showResult, loading, resultData, input, setInput } = useContext(Context);
  const messagesEndRef = useRef(null);

  const [typedMessages, setTypedMessages] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      onsent(input);
      setInput("");
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [typedMessages]);

  // Typing effect with setTimeout
 useEffect(() => {
  resultData.forEach((msg, idx) => {
    if ((msg.type === "ai" || msg.type === "ai_temp") && typedMessages[idx] !== msg.text) {
      let accumulated = "";
      let i = 0;

      const typeChar = () => {
        accumulated += msg.text[i]; // accumulate characters
        setTypedMessages((prev) => {
          const copy = [...prev];
          copy[idx] = accumulated; // set accumulated string in state
          return copy;
        });

        i++;
        if (i < msg.text.length) {
          setTimeout(typeChar, 5); // adjust typing speed here
        }
      };

      typeChar();
    }
  });
}, [resultData]);

  // Format AI reply for double asterisks **bold**
  const formatBold = (text) => {
    const elements = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const start = remaining.indexOf("**");
      if (start === -1) {
        elements.push(<span key={key}>{remaining}</span>);
        break;
      }
      const end = remaining.indexOf("**", start + 2);
      if (end === -1) {
        elements.push(<span key={key}>{remaining}</span>);
        break;
      }
      if (start > 0) elements.push(<span key={key++}>{remaining.slice(0, start)}</span>);
      elements.push(
        <span key={key++} style={{ fontWeight: "bold", fontSize: "1.2em" }}>
          {remaining.slice(start + 2, end)}
        </span>
      );
      remaining = remaining.slice(end + 2);
    }

    return elements;
  };

  // Voice input
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported!");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  // Image upload
  const handleImageUpload = () => {
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "image/*";
    inputEl.onchange = (e) => {
      const file = e.target.files[0];
      if (file) alert(`Selected image: ${file.name}`);
    };
    inputEl.click();
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Chat-bot</p>
        <img src={assets.user_icon} alt="user icon" />
      </div>

      <div className="main-container">
        {!showResult && (
          <>
            <div className="greet">
              <p><span>Hello, User.</span></p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="compass" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="bulb" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="message" />
              </div>
              <div className="card">
                <p>Improve readability of the following code</p>
                <img src={assets.code_icon} alt="code" />
              </div>
            </div>
          </>
        )}

        {showResult && (
          <div className="result">
            {resultData.map((msg, idx) => (
              <div
                key={idx}
                className={msg.type === "user" ? "result-title" : "result-data"}
              >
                <img
                  src={msg.type === "user" ? assets.user_icon : assets.gemini_icon}
                  alt={msg.type}
                />
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {msg.type === "ai" ? formatBold(typedMessages[idx] || "") : msg.text}
                </pre>
              </div>
            ))}

            {loading && (
              <div className="result-data">
                <img src={assets.gemini_icon} alt="ai" />
                <p>Typing <span className="dots">...</span></p>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

      <div className="main-bottom">
        <div className="Search-box">
          <input
            type="text"
            placeholder="Enter a prompt here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <div>
            <img
              src={assets.gallery_icon}
              alt="gallery"
              onClick={handleImageUpload}
              style={{ cursor: "pointer" }}
            />
            <img
              src={assets.mic_icon}
              alt="mic"
              onClick={handleVoiceInput}
              style={{ cursor: "pointer" }}
            />
            <img
              src={assets.send_icon}
              alt="send"
              onClick={handleSend}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <p className="bottom-info">
          Chat-bot may display inaccurate info including about people, so double-check its responses. Your privacy and Chat-bot Apps.
        </p>
      </div>
    </div>
  );
};

export default Main;
