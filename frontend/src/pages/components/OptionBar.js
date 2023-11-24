import React, { useEffect } from "react";
import Clock from "./Clock";
import { FaPencilAlt, FaMarker, FaPalette } from "react-icons/fa";
import "./OptionBar.css";
import { useState } from "react";

import {
  IoArrowUndoCircleSharp,
  IoArrowRedoCircleSharp,
} from "react-icons/io5";

import AudioRecorder from "./AudioSharing";


function OptionBar({
  onColorChange,
  onLineWidthChange,
  onLineDashChange,
  transferRightAns,
  onUndo,
  socket,
  roomId,
  timer,
  changeType,
}) {
  const [isItMyTurn, setIsItMyTurn] = useState(false);
  const [drawingName, setDrawingName] = useState("");
  const [wordSize, setWordSize] = useState("");
  const [playerName, setPlayerName] = useState("Player1");
  const undo = () => {
    // undo function here
    console.log("undo");
    socket.emit("undo", { roomId });
  };
  const redo = () => {
    // redo function here
    console.log("redo");
  };
  useEffect(() => {
    socket.emit("setDrawingName", {
      roomId,
      drawingName,
    });
  }, [drawingName, roomId, socket]);

  useEffect(() => {
    socket.on("setDrawingControl", (data) => {
      setIsItMyTurn(data);
    });
    socket.on("currentPlayerData", (data) => {
      const { pName, wSize } = data;
      setPlayerName(pName);
      setWordSize(wSize);
    });
  }, [socket]);

  return (
    <div className="container">
      <div className="logo">
        <h1>
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
              className="input colorInput"
              type="color"
              onChange={(e) => onColorChange(e.target.value)}
              style={{
                width: "30px",
                height: "30px",
                padding: "0",
                borderRadius: "5px",
              }}
            />
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <button
              onClick={() => {
                changeType("marker");
              }}
              style={{ fontSize: "20px", padding: "10px", margin: "10px" }}
            >
              <FaMarker />
            </button>

            <button
              onClick={() => {
                changeType("pencil");
              }}
              style={{ fontSize: "20x", padding: "8px", margin: "10px" }}
            >
              <FaPencilAlt />
            </button>

            <button
              onClick={() => {
                changeType("multicolour");
              }}
              style={{ fontSize: "20px", padding: "10px", margin: "10px" }}
            >
              <FaPalette />
            </button>

            <button
              onClick={() => {
                changeType("eraser");
              }}
              style={{ fontSize: "20px", padding: "10px", margin: "10px" }}
            >
              Eraser
            </button>
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
          <Clock socket={socket} initialTime={90} roomId={roomId} />
        </div>
      </div>
      {!isItMyTurn && (
        <div className="labelInputContainer">
          It's {playerName}'s turn to draw
        </div>
      )}

      {!isItMyTurn && (
        <div className="labelInputContainer">
          Word size: <b>{wordSize}</b>
        </div>
      )}
    </div>
  );
}

export default OptionBar;
