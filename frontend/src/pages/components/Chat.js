import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";

function Chat({ roomId, socket, name }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [isRight, setIsRight] = useState(false);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResp", handleReceiveMessage);
    return () => {
      socket.off("messageResp", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("getCorrectAns", { roomId, message });
    console.log("Message: " + message);
    socket.on("recieveCorrectAns", (data) => {
      setIsRight(data.right);
      console.log("response: " + data.right);
    });
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // setMessage(e.target.value);
    console.log(isRight);
    console.log(message);

    if (message.trim() !== "") {
      if (isRight) {
        setChats((prevChats) => [
          ...prevChats,
          { message: "GUESSED THE RIGHT ANS", user: "You" },
        ]);
      } else {
        setChats((prevChats) => [...prevChats, { message, user: "You" }]);
      }
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
              onChange={(e) => {
                setMessage(e.target.value);
                console.log(message);
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
