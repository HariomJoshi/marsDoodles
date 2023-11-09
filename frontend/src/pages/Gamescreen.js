import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import Onlineusers from "./components/Onlineusers";
import { useEffect, useState } from "react"

function Gamescreen() {
    return (
      <div className="gamescreen-container">
        <div className="canvas-and-chatroom-container">
          <Canvas />
          <Chat />
        </div>
        <div className="online-users-container">
          <Onlineusers />
        </div>
      </div>
    );
  }


  export default Gamescreen;
