import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinRoomPage from "./homescreencomp/JoinRoomPage";

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
      <JoinRoomPage />
    </>
  );
}

export default Home;
