import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Home.css";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:4000");

function Home({}) {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [createRoomType, setCreateRoomType] = useState("public");
  const [createRoomId, setCreateRoomId] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const jwt = cookies.get("jwt_auth");
  const location = useLocation();
  const name = location.state;

  const handleJoinRoom = (roomId) => {
    if(joinRoomId !== ""){
      const data = { userName: user, roomId: joinRoomId };
      socket.emit("joinUser", data);
      navigate(`/pages/game-screen/${joinRoomId}`, { state: name });
    }

    // const link = `http://localhost:4000/api/v1/createRoom/${joinRoomId}`;
    // axios
    //   .post(link, {
    //     type: createRoomType,
    //     jwt,
    //   })
    //   .then(() => {
    //     navigate(`/pages/game-screen/${joinRoomId}`);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleCreateRoom = () => {
    if(createRoomId !== ""){
      const data = { userName: user, roomId: createRoomId };
      socket.emit("joinUser", data);
      navigate(`/pages/game-screen/${createRoomId}`, { state: name });
    }

    // axios
    //   .post(`http://localhost:4000/api/v1/createRoom/${createRoomId}`, {
    //     type: createRoomType,
    //     jwt,
    //   })
    //   .then(() => {
    //     navigate(`/pages/game-screen/${createRoomId}`);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleRefresh = () => {
    axios
      .post("http://localhost:4000/api/v1/getAllPublicRooms", {
        jwt: jwt,
      })
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (!cookies.get("jwt_auth")) {
      navigate("/");
    }
    axios
      .post("http://localhost:4000/api/v1/getAllPublicRooms", {
        jwt: jwt,
      })
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <div>
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
        {/* <JoinRoomPage roomId={joinRoomId} socket={socket} /> */}
      </div>
      <div className="top-bar">
        <div className="logo">
          <h1 >
            bit<span className="logo-highlight">2</span>byte
          </h1>
        </div>
        <div className="profile-button">
          <button to="/profile">Profile</button>
          <button
            onClick={() => {
              setUser(null);
              cookies.remove("jwt_auth");
              navigate("/")
            }}
          >
            LogOut
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="left-column">
          <div className="available-rooms">
            <h2>Available Rooms</h2>
            <button className="refresh-button" onClick={handleRefresh}>
              Refresh
            </button>
          </div>
          <div className="room-list">
            {rooms.map((room) => (
              <div className="room" key={room._id}>
                <div className="room-info">
                  <p className="room-label">Room ID:</p>
                  <p className="room-data">{room.roomId}</p>
                </div>
                <div className="room-info">
                  <p className="room-label">Type:</p>
                  <p className="room-data">{room.type}</p>
                </div>
                <div className="room-info">
                  <p className="room-label">Admin:</p>
                  <p className="room-data">{room.admin}</p>
                </div>
                <button
                  className="join-button"
                  onClick={() => handleJoinRoom(room.roomId)}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="right-column">
          <div className="join-room-container">
            <h2>Join Room</h2>
            <div className="join-room">
              <input
                className="roomId-input"
                type="text"
                placeholder="Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
              />
              <button className="join-button" onClick={handleJoinRoom}>
                Join
              </button>
            </div>
          </div>
          <div className="create-room-container">
            <h2>Create Room</h2>
            <div className="create-room">
              <select
                className="roomId-input"
                value={createRoomType}
                onChange={(e) => setCreateRoomType(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <input
                type="text"
                placeholder="Room ID"
                value={createRoomId}
                onChange={(e) => setCreateRoomId(e.target.value)}
              />
              <button className="create-join-button" onClick={handleCreateRoom}>
                Create & Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
