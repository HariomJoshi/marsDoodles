import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Home.css";
import { BASE_URL, BACKEND_URL } from "./helper";
import ProfileModal from "./homescreencomp/popups/ProfileModal";
const io = require("socket.io-client");
const socket = io.connect(BACKEND_URL);

function Home({}) {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [createRoomType, setCreateRoomType] = useState("public");
  const [player2Invited, setPlayer2Invited] = useState("Invite");
  const [player3Invited, setPlayer3Invited] = useState("Invite");
  const [player2Mail, setPlayer2Mail] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [player3Mail, setPlayer3Mail] = useState();
  const [copyText, setCopyText] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const jwt = cookies.get("jwt_auth");
  const location = useLocation();
  // const name = location.state;
  const name = "Your Name";

  const handleJoinRoom = (roomId) => {
    if (joinRoomId !== "") {
      const data = { userName: user, roomId: joinRoomId };
      axios
        .post(`${BASE_URL}/createRoom/${roomId}`, {
          jwt: jwt,
          type: createRoomType,
        })
        .then((response) => {
          console.log("Room created");
        })
        .catch((error) => {
          console.log("Error creating room: ", error);
        });
      navigate(`/pages/game-screen/${joinRoomId}`, { state: name });
    }
  };

  const handleCreateRoom = () => {
    let ans = "x"
      .repeat(25)
      .replace(
        /./g,
        (c) =>
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[
            Math.floor(Math.random() * 72)
          ]
      );
    setCopyText(ans);
    console.log(ans);
  };

  const handleInvite = (email, no) => {
    if (email !== "") {
      axios
        .post(`${BASE_URL}/sendInvitationMail`, {
          jwt: jwt,
          link: copyText,
          email: email,
        })
        .then((response) => {
          console.log(no);
          if (no === "2") {
            console.log("Reached no 2");
            setPlayer2Invited("Successful ✅");
          } else if (no === "3") {
            setPlayer3Invited("Successful ✅");
          }
          console.log("Email sent");
        })
        .catch((error) => {
          if (no === "2") {
            setPlayer2Invited("Failed ❌. Try again.");
          }
          if (no === "3") {
            setPlayer3Invited("Failed ❌. Try again.");
          }
          console.log("Error fetching data: ", error);
        });
    }
  };

  useEffect(() => {
    if (player2Invited) {
    }
  }, [player2Invited]);

  const handleRefresh = () => {
    axios
      .post(`${BASE_URL}/getAllPublicRooms`, {
        jwt: jwt,
      })
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  function joinFromSide(roomId) {
    console.log(roomId);
    const data = { userName: user, roomId: roomId };
    // socket.emit("joinUser", data);
    navigate(`/pages/game-screen/${roomId}`, { state: name });
  }

  useEffect(() => {
    if (!cookies.get("jwt_auth")) {
      navigate("/");
    }
    axios
      .post(`${BASE_URL}/getAllPublicRooms`, {
        jwt: jwt,
      })
      .then((response) => {
        setRooms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <div className="logo">
          <h1>
            bit<span className="logo-highlight">2</span>byte
          </h1>
        </div>
        <div className="profile-button">
          <ProfileModal
            userId={name.name}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
          <button onClick={openModal}>Profile</button>
          <button
            onClick={() => {
              setUser(null);
              cookies.remove("jwt_auth");
              navigate("/");
            }}
          >
            LogOut
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="left-column">
          <div className="available-rooms">
            <h3>Available Rooms</h3>
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
                  onClick={() => {
                    joinFromSide(room.roomId);
                  }}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="right-column">
          <div className="join-create-container">
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
                <div className="invite-section">
                  <label>
                    Player 2:
                    <input
                      type="text"
                      placeholder="Enter email to invite ..."
                      onChange={(e) => setPlayer2Mail(e.target.value)}
                    />
                    <button
                      onClick={(e) => {
                        handleInvite(player2Mail, "2");
                      }}
                    >
                      {player2Invited}
                    </button>
                  </label>
                </div>
                <div className="invite-section">
                  <label>
                    Player 3:
                    <input
                      type="text"
                      placeholder="Enter email to invite ..."
                      onChange={(e) => setPlayer3Mail(e.target.value)}
                    />
                    <button
                      onClick={(e) => {
                        handleInvite(player3Mail, "3");
                      }}
                    >
                      {player3Invited}
                    </button>
                  </label>
                </div>
                <div className="generate-section">
                  <input type="text" defaultValue={copyText} />
                  <button
                    className="create-join-button"
                    onClick={handleCreateRoom}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
