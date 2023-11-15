import React, { useState } from "react";
import "./Onlineusers.css";

function Onlineusers({ usersData,  name}) {
  if (!usersData) {
    // to handle invalid requests
    return <></>;
  }
  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {usersData.map((data) => (
          <div className="picIcon">
            <img
              className="avatar"
              alt=""
              src={`https://robohash.org/${data.playerId}.png`}
            />
            <p style={{ fontSize: "12px", textAlign: "center" }}>
              {name}
            </p>
            <p style={{ fontSize: "10px" }}>{data.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Onlineusers;
