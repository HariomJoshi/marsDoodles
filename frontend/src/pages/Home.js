import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/button";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Button
        colorScheme="blue"
        onClick={() => {
          {
            localStorage.removeItem("token");
            navigate("/");
          }
        }}
      >
        LOG OUT
      </Button>
      <b>Hello welcome to the home screen</b>
    </>
  );
}

export default Home;
