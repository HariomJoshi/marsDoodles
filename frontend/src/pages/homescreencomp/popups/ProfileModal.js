import { useEffect, useState } from "react";
import "./profile.css";
import ScrollableModal from "../Modals/ScrollableModal";
import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL } from "../../helper";
import { jwtDecode } from "jwt-decode";

const ProfileModal = ({ userEmail, isModalOpen, closeModal }) => {
  const [gamesHistory, setGamesHistory] = useState([]);
  const cookies = new Cookies();
  const jwt = cookies.get("jwt_auth");
  const decoded = jwtDecode(jwt);
  // fetch code working fine
  useEffect(() => {
    // fetching all the games history and setting it
    axios
      .post(`${BASE_URL}/allGames`, {
        userEmail: decoded.email,
        jwt,
        // just for middleware purposes
      })
      .then((res) => {
        setGamesHistory(res.data.games);
        // console.log(gamesHistory);
        // post request to update players gamehistory
      })
      .catch((error) => {
        console.error("Error fetching data ", error);
      });
  }, [gamesHistory]);

  return (
    <>
      <ScrollableModal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="ALLL">
          <div className="profilepic">
            <img
              className="avatar"
              alt="Profile picture"
              src={`https://robohash.org/${userEmail}.png`}
            />
          </div>
          <hr />
          <b style={{ fontSize: "30px" }}>{decoded.email}</b>
          <hr />
          <b style={{ position: "center", margin: "3%" }}>GAMES HISTORY</b>
          <div className="gamesHistory">
            {gamesHistory.map((entry, index) => (
              <div className="oneEntry" key={index * 999}>
                <div className="field">
                  <b> Date: </b>
                  {new Date(entry.createdAt).toISOString().split("T")[0]}
                </div>
                <div className="field">
                  <b> Time: </b>
                  {new Date(entry.createdAt).toTimeString().split(" ")[0]}
                </div>
                <div className="field">
                  <b> Score: </b>
                  {entry.score}
                </div>
                <div className="field">
                  <b> Rank: </b>
                  {entry.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollableModal>
    </>
  );
};

export default ProfileModal;
