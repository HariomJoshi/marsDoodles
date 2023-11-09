import React, { useEffect, useState } from "react";
import axios from "axios";

function Chat() {
  const [chats, setChats] = useState([]);
  async function fetchChats() {
    const { data } = await axios.get("http://localhost:5000/game/chats");
    console.log(data);
    setChats(data);
  }
  // use effect executes whenever the componenet runs
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div>{chat.chatName}</div>
      ))}
    </div>
  );
}

export default Chat;
