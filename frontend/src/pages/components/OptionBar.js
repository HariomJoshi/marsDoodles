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
}) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isItMyTurn, setIsItMyTurn] = useState(false);
  const [drawingName, setDrawingName] = useState("");

  // useEffect(() => {
  // socket.emit("currentRightAns", { roomId, drawingName });
  // socket.on("rightAns", (ans) => {
  //   transferRightAns(ans.rightAns);
  //   console.log(ans.rightAns);
  // });
  // }, [socket]);

  return (
    <div className="container">
      <div className="logo">
        <h1>bit2byte</h1>
      </div>
      <div className="controls">
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label">Line Width:</label>
            <input
              className="input"
              type="number"
              min="1"
              onChange={(e) => onLineWidthChange(Number(e.target.value))}
            />
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label">Line Color:</label>
            <input
              className="input"
              type="color"
              onChange={(e) => onColorChange(e.target.value)}
            />
          </div>
        )}
        {isItMyTurn && (
          <div className="labelInputContainer">
            <label className="label">Line Dash:</label>
            <input
              className="input"
              type="text"
              onChange={(e) => onLineDashChange(e.target.value)}
            />
          </div>
        )}
        <div className="labelInputContainer">
          <Clock initialTime={60} />
        </div>
      </div>

      {/* {isItMyTurn && ( */}
      <div className="labelInputContainer">
        <label className="label">Drawing: </label>
        <input
          className="input"
          type="text"
          onChange={(e) => {
            // console.log(e.target.value);
            setDrawingName(e.target.value);
            socket.emit("currentRightAns", { roomId, drawingName });
          }}
        />
      </div>
      {/* )} */}

      {!isItMyTurn && (
        <div className="labelInputContainer">
          Word size: <b>{drawingName.length}</b>
          {/* {console.log(drawingName)}   */}
        </div>
      )}
    </div>
  );
}

export default OptionBar;
