import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinRoomPage from "./homescreencomp/JoinRoomPage";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:4000");

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      console.log(localStorage.getItem("userInfo"));
    }
  }, []);

  return (
    <>
      <button
        colorscheme="blue"
        onClick={() => {
          {
            localStorage.removeItem("userInfo");
            navigate("/");
          }
        }}
      >
        LOG OUT
      </button>
      <b>Hello welcome to the home screen</b>
      <JoinRoomPage socket={socket} />
    </>
  );
}

export default Home;
