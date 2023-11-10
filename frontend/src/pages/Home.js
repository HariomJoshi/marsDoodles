import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        colorScheme="blue"
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
    </>
  );
}

export default Home;
