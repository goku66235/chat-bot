import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ContextProvider from "./context/Context"; // ✅ default import

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
