import React, { useState } from "react";
import { useEffect } from "react";
import "./Onlineusers.css";

function Onlineusers({ socket,  name}) {
  const [usersData, setUsersData] = useState();

  useEffect(() => {
    socket.on("userUpdate", (data) => {
      setUsersData(data.players);
    });
  }, [socket, usersData]);

  useEffect (()=>{
    socket.on("startGame",(data)=>{
      setUsersData(data.players);
    })
  },[socket, usersData])

  if (!usersData) {
    // to handle invalid requests
    return <></>;
  }


  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {Array.isArray(usersData) && usersData.map((data) => (
          <div className="picIcon">
            <img
              className="avatar"
              alt=""
              src={`https://robohash.org/${data.playerId}.png`}
            />
            <p style={{ fontSize: "12px", textAlign: "center" }}>{data.playerName}</p>
            <p style={{ fontSize: "10px" }}>{data.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Onlineusers;
