import "./Gamescreen.css";
import React, { useEffect, useState } from "react";
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
  const [drawingName, setDrawingName] = useState("");
  const [usersData, setUsersData] = useState();
  const [name, setName] = useState();
  const data = location.state;
  // useEffect(() => {
  //   setName(localStorage.getItem("name"));
  // }, []);

  useEffect(() => {
    socket.on("userUpdate", (data) => {
      setUsersData(data.players);
    });
    console.log(usersData);
  }, [socket, usersData]);

  console.log("Gamescreen data " + drawingName);
  return (
    <div className="ALL">
      <div className="gamescreen-container">
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
              transferRightAns={(ans) => setDrawingName(ans)}
              roomId={id}
              socket={socket}
              // onApplyOptions={applySelectedOptions}
            />
            {console.log("Drawing name: " + drawingName)}
          </div>
          <div className="drawingBoard">
            <Canvas
              selectedColor={selectedColor}
              selectedLineWidth={selectedLineWidth}
              selectedLineDash={selectedLineDash}
              roomId={id}
              socket={socket}
              // name={name}
            />
          </div>

          <p>ONLINE USERS:</p>
          <div className="online-users-container">
            <Onlineusers usersData={usersData}></Onlineusers>
          </div>
        </div>
        <div className="chat-section">
          <Chat
            roomId={id}
            socket={socket}
            name={data.name}
            rightAns={drawingName}
          />
        </div>
      </div>
    </div>
  );
}

export default Gamescreen;
