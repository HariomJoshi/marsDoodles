import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import "./Chat.css";

function Chat() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p>CHAT SECTION</p>
      <div className="chatsection">
        <div className="chats">all chats will be shown here</div>
        <div className="textField">
          <div className="message-field-container">
            <input
              className="message-field"
              type="text"
              placeholder="Enter message"
              name="Name"
            ></input>
          </div>
          <div className="send-button-container">
            <button className="send">SEND</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
