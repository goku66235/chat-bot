import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { prevPrompt, resetChat } = useContext(Context);

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      <div className="top">
        <img
          onClick={() => setExpanded(!expanded)}
          className="menu"
          src={assets.menu_icon}
          alt="menu"
        />

        {expanded && (
          <div className="newchat" onClick={resetChat}>
            <img src={assets.plus_icon} alt="new chat" />
            <p>New Chat</p>
          </div>
        )}

        {expanded && prevPrompt && prevPrompt.length > 0 && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompt.map((item, index) => (
              <div key={index} className="recent-entry">
                <img src={assets.message_icon} alt="msg" />
                <p>{item.length > 20 ? item.slice(0, 20) + "..." : item}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="help" />
          {expanded && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="activity" />
          {expanded && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="settings" />
          {expanded && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
