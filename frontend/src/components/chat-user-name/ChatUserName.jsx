import React from "react";
import "./ChatUserName.css";
const ChatUserName = ({ name }) => {
  return (
    <div className="name-plate">
      <div className="name-area">{name}</div>
      <div className="online-dot"></div>
    </div>
  );
};

export default ChatUserName;
