import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/')
        }
    },[])

    return( 
        <>
            <button onClick={()=>{
                {localStorage.removeItem('token')
                navigate('/')}
                
            }}>LOG OUT</button>
            <b>Hello welcome to the home screen</b>
        </>
    )
    
}


export default Home;