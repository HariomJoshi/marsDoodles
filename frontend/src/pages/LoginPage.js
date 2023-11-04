import "./LoginPage.css"
import { useState } from "react";

function LoginPage(){
    let [passType, setPassType] = useState("password");
    return(
        <div className ="everyThing">
            <div className="enterDetails">
                <div className="centerPart">
                    <h1 className="login">Hey, hello! 👋</h1>
                    <p className="lightText">Enter the information you entered while registering</p>
                    <legend className = "login">Email: </legend>
                    <input  className="inp"/>
                    <legend className = "login">Password: </legend>
                    <input className = "inp" type = {passType}/>
                    <div className="showPassword">
                        <p className = "lightText">Show password: </p>
                        <input className="checkbox" type="checkbox" onClick={() =>{passType == "password"? setPassType("text"): setPassType("password")}} />    
                    </div>
                    <button className="loginBtn">Login</button>
                </div>
            
            </div>


            <div className="sideText">
                
                <div className="centerSquare">
                    <h1 id="message"><div className="text">Draw<br/> and guess<br/> BETTER<br/></div>  and easier </h1>
                    <p className="subHeading">Stream to any platform<br/> from anywhere</p>
                </div>
                
            </div>
        </div>

    );
}

export default LoginPage;