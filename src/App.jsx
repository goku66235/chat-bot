import React from "react";
import Sidebar from "./componets/Sidebar/Sidebar";
import Main from "./componets/Main/Main";
import ContextProvider from "./context/Context";
import "./index.css";

const App = () => {
  return (
    <ContextProvider>
      <div className="app">
        <Sidebar />
        <Main />
      </div>
    </ContextProvider>
  );
};

export default App;
