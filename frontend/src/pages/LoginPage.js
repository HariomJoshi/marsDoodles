import "./LoginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "./helper";

function LoginPage() {
  let [passType, setPassType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/login`, {
        email: email,
        password: password,
      })
      .then((result) => {
        const cookie = new Cookies();
        console.log(result);
        const jwt_token = result.data.jwt_token;
        const decoded = jwtDecode(jwt_token);
        setUser(decoded);
        cookie.set("jwt_auth", jwt_token, {
          expires: new Date(decoded.exp * 10000),
        });
        console.log(result.data.user.name);
        navigate("/home", { state: { name: result.data.user.name } });
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 403) {
          alert("Email or password incorrect");
        } else if (e.response.status === 400) {
          alert("Please fill all the details");
        } else if (e.response.status === 401) {
          alert("Email or password incorrect");
        } else if (e.response.status === 500) {
          alert("Unexpected error at server");
        }
      });
  }

  return (
    <div className="everyThing">
      <div className="enterDetails">
        <div className="centerPartlogin">
          <h1 className="login">Hey, hello! 👋</h1>
          <form onSubmit={submit}>
            <p className="lightText">
              Enter the information you entered while registering
            </p>
            <legend className="login">Email: </legend>
            <input
              className="inp"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <legend className="login">Password: </legend>
            <input
              className="inp"
              type={passType}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="showPassword">
              <p className="lightText">Show password: </p>
              <input
                className="checkbox"
                type="checkbox"
                onClick={() => {
                  passType == "password"
                    ? setPassType("text")
                    : setPassType("password");
                }}
              />
            </div>
            <div className="register-link">
              <p>
                <Link to="/register">haven't registered yet? click here</Link>
              </p>
            </div>
            <button type="submit" className="loginBtn" onClick={submit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
