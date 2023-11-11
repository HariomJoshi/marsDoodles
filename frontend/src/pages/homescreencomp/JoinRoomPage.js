import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:4000");

function JoinRoomPage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const myState = { roomId };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #3498db",
    borderRadius: "8px",
    marginRight: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  function joinRoom() {
    // console.log(roomId);
    socket.emit("joinUser", roomId);
  }

  const handleclick = () => {
    if (roomId) {
      console.log("Joined room: " + roomId);
      joinRoom();
      navigate("/pages/game-screen", { state: myState });
    }
  };
  return (
    <div>
      <input
        style={inputStyle}
        type="text"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button style={buttonStyle} onClick={handleclick}>
        JOIN
      </button>
    </div>
  );
}

export default JoinRoomPage;
