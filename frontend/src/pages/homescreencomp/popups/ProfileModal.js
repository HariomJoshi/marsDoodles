import { useEffect, useState } from "react";
import "./profile.css";
import ScrollableModal from "../../modal/ScrollableModal";
import axios from "axios";
import Cookies from "universal-cookie";

const ProfileModal = ({ userEmail, isModalOpen, closeModal }) => {
  const [gamesHistory, setGamesHistory] = useState([]);
  console.log("Reached profile Modal " + isModalOpen);
  const cookies = new Cookies();
  const jwt = cookies.get("jwt_auth");
  useEffect(() => {
    // fetching all the games history and setting it
    axios
      .post("http://localhost:4000/api/v1/allGames", {
        userEmail: "hariomjoshi@gmail.com",
        jwt,
        // just for middleware purposes
      })
      .then((res) => {
        // console.log(res.data.games);
        setGamesHistory(res.data.games);
        console.log(gamesHistory);
      })
      .catch((error) => {
        console.error("Error fetching data ", error);
      });
  }, [gamesHistory]);

  return (
    <>
      <ScrollableModal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="ALL">
          <div className="profilepic">
            <img
              className="avatar"
              alt="Profile picture"
              src={`https://robohash.org/${userEmail}.png`}
            />
          </div>
          <b style={{ fontSize: "40px", fontFamily: "revert-layer" }}>
            {userEmail}
          </b>
          <div className="gamesHistory">
            <b>GAMES HISTORY</b>
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
