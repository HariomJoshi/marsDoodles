import "./Gamescreen.css";
import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import OptionBar from "./components/OptionBar";
import Onlineusers from "./components/Onlineusers";
import { useLocation, useParams } from "react-router-dom";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:4000");

function Gamescreen() {
  const { id } = useParams();
  const location = useLocation();
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedLineWidth, setSelectedLineWidth] = useState(2);
  const [selectedLineDash, setSelectedLineDash] = useState("");
  const data = location.state;

  console.log("Gamescreen data " + data.name.email);
  return (
    <div className="ALL">
      <div className="gamescreen-container">
        <h1 className="Main-logo">bit2byte</h1>
        <div className="canvas-and-online-users-container">
          <div className="option-bar">
            {/* {console.log(data)} */}
            <OptionBar
              selectedColor={selectedColor}
              selectedLineWidth={selectedLineWidth}
              selectedLineDash={selectedLineDash}
              onColorChange={(color) => setSelectedColor(color)}
              onLineWidthChange={(width) => setSelectedLineWidth(width)}
              onLineDashChange={(dash) => setSelectedLineDash(dash)}
              // onApplyOptions={applySelectedOptions}
            />
          </div>
          <div className="drawingBoard">
            <Canvas
              selectedColor={selectedColor}
              selectedLineWidth={selectedLineWidth}
              selectedLineDash={selectedLineDash}
              roomId={id}
              socket={socket}
              name={data.name.name}
              email={data.name.email}
            />
          </div>

          <p>ONLINE USERS:</p>
          <div className="online-users-container">
            <Onlineusers
              name={data.name}
              socket={socket}
              roomId={id}
              email={data.name.email}
            />
          </div>
        </div>
        <div className="chat-section">
          <Chat roomId={id} socket={socket} name={data.name.name} />
        </div>
      </div>
    </div>
  );
}

export default Gamescreen;
