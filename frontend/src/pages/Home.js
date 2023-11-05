import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home(){
    const location = useLocation();
    return(
        <>
            <b>Hello welcome to the home screen</b>
        </>
    )
}


export default Home;