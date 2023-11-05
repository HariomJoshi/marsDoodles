import "./LoginPage.css"
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'


function RegisterPage() {
    let [passType, setPassType] = useState("password");
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    function submit(e){
        e.preventDefault();
        axios.post("http://localhost:4000/api/v1/signup", {   
            name:name, 
            email:email, 
            password:password})
            .then(result=>console.log(result))
            .catch(err=>{
                console.log(err)
                if(err.response.status == 400){
                    alert("User already exists!")
                }else if(err.response.status == 401){
                    alert("Please enter all the details")
                }
                else{
                    alert("Internal server error, please try again")
                }
            });
    }
    return(
        <div className ="everyThing">
            <div className="enterDetails">
                
                <div className="centerPartSignup">
                    <h1 className="login">Hey, hello! 👋</h1>

                    <form onSubmit={submit}>
                    <p className="lightText">Register Here</p>
                    <legend className = "login" >Name: </legend>
                    <input  
                    className="inp" 
                    type = "name" 
                    onChange={(e) =>{setName(e.target.value)}}
                    />
                    <legend className = "login" >Email: </legend>
                    <input  
                    className="inp"
                     type = "email"
                     onChange={(e) =>{setEmail(e.target.value)}}
                    />
                    <legend className = "login">Password: </legend>
                    <input 
                    className = "inp" 
                    type = {passType} 
                    onChange={(e) =>{setPassword(e.target.value)}}
                    />
                    <legend className = "login">Confirm Password: </legend>
                    <input className = "inp" type = {passType}/>
                    <div className="showPassword">
                        <p className = "lightText">Show password: </p>
                        <input className="checkbox" type="checkbox" onClick={() =>{passType == "password"? setPassType("text"): setPassType("password")}} />    
                    </div>
                    <div className="register-link">
                        <p><Link to="/">Already registered? click here</Link></p>
                    </div>
                    <button className="loginBtn">Register</button>
                    </form>
                </div>
                
            </div>


            <div className="sideText">
                
                <div className="centerSquare">
                    <h1 id="message"><div className="text">Draw<br/> and guess<br/> BETTER<br/></div>  and easier </h1>
                    <p className="subHeading">Guess it or not<br/> doesen't matter</p>
                </div>
                
            </div>

        </div>
    )
}


export default RegisterPage;