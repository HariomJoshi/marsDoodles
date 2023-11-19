import React, { useEffect } from "react";
import Clock from "./Clock";
import "./OptionBar.css";
import { useState } from "react";

function OptionBar({
  onColorChange,
  onLineWidthChange,
  onLineDashChange,
  transferRightAns,
  socket,
  roomId,
  timer,
  changeType
}) {
  const [isItMyTurn, setIsItMyTurn] = useState(false);
  const [drawingName, setDrawingName] = useState("");
  const [wordSize, setWordSize] = useState("");
  const [playerName, setPlayerName] = useState("Player1");

  useEffect(() => {
    socket.emit("setDrawingName", {
      roomId,
      drawingName,
    });
  }, [drawingName, roomId, socket]);

  useEffect(()=>{
    socket.on("setDrawingControl",(data)=>{
      setIsItMyTurn(data);
    })
    socket.on("currentPlayerData",(data)=>{
      const {pName, wSize} = data;
      setPlayerName(pName);
      setWordSize(wSize)
    })
  },[socket])

  return (
    <div className="container">
     <div className="logo">
          <h1 >
            bit<span className="logo-highlight">2</span>byte
          </h1>
        </div>
      <div className="controls">
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label"></label>
            <input
              className="rangeInput"
              type="range"
              min="1"
              max="60"
              onChange={(e) => onLineWidthChange(Number(e.target.value))}
            />
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label"></label>
            <input
              className="input"
              type="color"
              onChange={(e) => onColorChange(e.target.value)}
            />
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <button onClick={()=>{changeType("pencil")}}>Pencil</button>
            <button onClick={()=>{changeType("circle")}}>Circle</button>
            <button onClick={()=>{changeType("square")}}>Square</button>
            <button onClick={()=>{changeType("rectangle")}}>Rectangle</button>
            <button onClick={()=>{changeType("ellipse")}}>Ellipse</button>
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label"></label>
            <input
              className="input"
              type="text"
              onChange={(e) => onLineDashChange(e.target.value)}
            />
          </div>
        )}
        <div className="labelInputContainer">
          <Clock socket={socket} initialTime={900000} roomId={roomId}/>
        </div>
      </div>
      {
        !isItMyTurn && (
          <div className="labelInputContainer">
            It's {playerName}'s turn to draw
          </div>
        )
      }

      {!isItMyTurn && (
        <div className="labelInputContainer">
          Word size: <b>{wordSize}</b>
        </div>
      )}
    </div>
  );
}

export default OptionBar;
