import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import Onlineusers from "./components/Onlineusers";
import "./Gamescreen.css";
import { useEffect, useState } from "react";

function Gamescreen() {
  return (
    <div className="ALL">
      <div className="gamescreen-container">
        <div className="canvas-and-online-users-container">
          <div class="drawigBoard">
            <Canvas />
          </div>

          <p>ONLINE USERS:</p>
          <div class="online-users-container">
            <Onlineusers />
          </div>
        </div>
        <div className="chat-section">
          <Chat className="chat" />
        </div>
      </div>
    </div>
  );
}

export default Gamescreen;
