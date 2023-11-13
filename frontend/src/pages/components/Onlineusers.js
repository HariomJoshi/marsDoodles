import React from "react";
import "./Onlineusers.css";
function Avatar({usersData}) {
  if(!usersData){
    // to handle invalid requests 
    return <></>
  }
  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {usersData.map((data) => (
          <div className="picIcon">
            <img className="avatar" alt="" src={`https://robohash.org/${data.playerId}.png`} />
            <p style={{ fontSize: "12px", textAlign: "center" }}>{data.playerId}</p>
            <p style={{ fontSize: "10px" }}>{data.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Onlineusers({usersData}) {
  return (
    <div>
      <Avatar usersData={usersData}/>
    </div>
  );
}

export default Onlineusers;
