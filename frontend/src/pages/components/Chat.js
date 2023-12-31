import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";

function Chat({ roomId, socket, name }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResp", handleReceiveMessage);
    return () => {
      socket.off("messageResp", handleReceiveMessage);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setChats((prevChats) => [
        ...prevChats,
        { message, user: "You", id: socket.id },
      ]);
      socket.emit("message", { message, roomId, name });
      setMessage("");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <form onSubmit={handleSubmit} className="chatsection">
        <div className="chats">
          {console.log(chats)}
          {chats.map((msg, index) => (
            <p key={index * 999} className="oneChat">
              <img src={`https://robohash.org/${msg.id}.png`} alt="" />
              {msg.user}: {msg.message}
            </p>
          ))}
        </div>
        <div className="textField">
          <div className="message-field-container">
            <input
              className="message-field"
              type="text"
              placeholder="Enter message"
              name="Name"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // console.log(message);
              }}
            ></input>
          </div>
          <div className="send-button-container">
            <button className="send"></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Chat;
