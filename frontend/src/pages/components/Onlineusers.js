import React, { useState, useEffect } from "react";
import "./Onlineusers.css";

function Onlineusers({ socket, name,roomId }) {
  const [usersData, setUsersData] = useState([]);
  const [isAdmin, setisAdmin] = useState(false);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      socket.emit("amIAdmin",{roomId:roomId});
    }, 1000);

    return () => clearTimeout(timeoutId); 
  }, []);

  useEffect(() => {
    socket.on("yesYouAreAdmin",()=>{
      setisAdmin(true)
    })
    socket.on("userUpdate", (data) => {
      setUsersData(data.players);
    });
  }, [socket, usersData]);

  useEffect(() => {
    socket.on("startGame", (data) => {
      setUsersData(data.players);
    });
  }, [socket, usersData]);

  const handleKick = (playerId) => {
    console.log(`Kicking user ${playerId}`);
    socket.emit("kickUser",{id:playerId, roomId})
  };

  const handleRestrict = (playerId) => {
    console.log(`Restricting user ${playerId}`);
    socket.emit("chatRestrict",{id:playerId, roomId})
  };

  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {Array.isArray(usersData) &&
          usersData.map((data) => (
            <div key={data.playerId} className="picIcon">
              <img
                className={`avatar ${data.isChatRestricted ? "redCircle" : ""}`}
                alt=""
                src={`https://robohash.org/${data.playerId}.png`}
              />
              <p style={{ fontSize: "12px", textAlign: "center" }}>
                {data.playerName}
              </p>
              <p style={{ fontSize: "10px" }}>{data.points}</p>
              { isAdmin && 
              <div className="buttonContainer">
                <button
                  className="kick-button"
                  onClick={() => handleKick(data.playerId)}
                >
                  Kick
                </button>
                <button
                  className="restrict-button"
                  onClick={() => handleRestrict(data.playerId)}
                >
                  Restrict
                </button>
              </div>
              }
            </div>
          ))}
      </div>
    </div>
  );
}

export default Onlineusers;
