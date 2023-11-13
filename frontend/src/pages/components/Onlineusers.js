import React, { useState } from "react";
import "./Onlineusers.css";

function Onlineusers({ socket, roomId }) {
  const [online, setOnline] = useState([]);
  socket.emit("onlineusers", roomId);
  socket.on("currentOnlineUsers", (users) => {
    // console.log(users.length);
    setOnline(users);
  });
  console.log(online);

  let images = new Array();
  images[0] =
    "https://i.pinimg.com/564x/b9/aa/d1/b9aad114e8d8fe6650b238f3516fc5a7.jpg";
  images[1] =
    "https://i.pinimg.com/564x/70/a6/cc/70a6cc1610b0da9aa18cf197d4a14d42.jpg";
  images[2] =
    "https://i.pinimg.com/564x/37/01/43/370143d737f98e0f783f51f1d5da13bf.jpg";
  images[3] =
    "https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg";

  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {online.map((user) => (
          <div className="picIcon">
            <img
              className="avatar"
              src="https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg"
            />
            <p style={{ fontSize: "12px", textAlign: "center" }}>{user.name}</p>
            <p style={{ fontSize: "10px" }}>100</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Onlineusers;
