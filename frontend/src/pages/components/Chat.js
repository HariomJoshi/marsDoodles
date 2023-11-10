import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

function Chat() {
  // to use the variables inside context api chatprovider
  const { user } = ChatState();

  return <div></div>;
}

export default Chat;
