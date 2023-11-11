import "./Gamescreen.css";
import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Chat from "./components/Chat";
import OptionBar from "./components/OptionBar";
import Onlineusers from "./components/Onlineusers";
import { useLocation } from "react-router-dom";

function Gamescreen() {
  const location = useLocation();
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedLineWidth, setSelectedLineWidth] = useState(2);
  const [selectedLineDash, setSelectedLineDash] = useState("");
  const data = location.state;

  // console.log(data.roomId);
  return (
    <div className="ALL">
      <div className="gamescreen-container">
        <div className="canvas-and-online-users-container">
          <div className="option-bar">
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
              roomId={data.roomId}
            />
          </div>

          <p>ONLINE USERS:</p>
          <div className="online-users-container">
            <Onlineusers />
          </div>
        </div>
        <div className="chat-section">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Gamescreen;
