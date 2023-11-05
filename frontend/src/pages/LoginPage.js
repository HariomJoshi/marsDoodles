import "./LoginPage.css"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function LoginPage(){
    let [passType, setPassType] = useState("password");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function submit(e){
        e.preventDefault();
        axios.post("http://localhost:4000/api/v1/login", {email:email, password:password})
        .then(result =>{console.log(result)
            localStorage.setItem('token',result.data.token)
            navigate('/home')
        })
        .catch(e => {
            console.log(e)
            if(e.response.status == 403){
                alert("Email or password incorrect")
            }else if(e.response.status == 400){
                alert("Please fill all the details")
            }else if(e.response.status == 401){
                alert("Email or password incorrect")
            }else if(e.response.status == 500){
                alert("Unexpected error at server")
            }
        });
    }
    
    return(
        <div className ="everyThing">
            <div className="enterDetails">
                <div className="centerPartlogin">
                    <h1 className="login">Hey, hello! 👋</h1>
                    <form onSubmit={submit}>
                        <p className="lightText">Enter the information you entered while registering</p>
                        <legend className = "login">Email: </legend>
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
                        <div className="showPassword">
                            <p className = "lightText">Show password: </p>
                            <input 
                            className="checkbox" 
                            type="checkbox" 
                            onClick={() =>{passType == "password"? setPassType("text"): setPassType("password")}} 
                            />    
                        </div>
                        <div className="register-link">
                            <p><Link to="/register">haven't registered yet? click here</Link></p>
                        </div>
                        <button 
                        type = "submit" className="loginBtn" onClick={submit}>Login</button>
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

    );
}

export default LoginPage;