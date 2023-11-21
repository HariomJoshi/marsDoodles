import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const GePopup = ({ isModalOpen, socket, roomId }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);
  const [players, setPlayers] = useState([]);

  socket.on("finalGameEnd", (data) => {
    setPlayers(data.players);
    setModalIsOpen(true);
  });

  const myStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      position: 'relative',
      backgroundColor: '#f9f9f9',
      padding: '30px 30px 30px 30px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
      maxWidth: '500px',
      width: '100%',
      overflow: 'hidden',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      cursor: 'pointer',
      fontSize: '24px',
      color: '#333',
    },
    playerList: {
      listStyle: 'none',
      padding: '0',
      marginTop: '20px',
    },
    playerListItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    playerImage: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '2px solid black',
      marginRight: '15px',
    },
    playerName: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    playerPoints: {
      fontSize: '16px',
    },
    nextRoundButton: {
      backgroundColor: '#3498DB',
      color: 'white',
      padding: '15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 'bold',
      marginTop: '20px',
      transition: 'background-color 0.3s',
    },
    nextRoundButtonHover: {
      backgroundColor: '#45a049',
    },
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/home")
    setModalIsOpen(false);
  };

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Score Board" style={myStyle}>
      <div>
        <h1 style={{ marginBottom: '10px', fontSize: '25px', backgroundColor: 'black', padding: '10px'}}>GAME ENDS</h1>
        <h2 style={{ color:'black', marginBottom: '20px', fontSize: '20px', backgroundColor: 'white', padding: '10px'}}>Thank you for playing 🎮</h2>
        <ul style={myStyle.playerList}>
          {Array.isArray(players) &&
            players.map((player) => (
              <li key={player.playerId} style={myStyle.playerListItem}>
                <img
                  src={`https://robohash.org/${player.playerId}.png`}
                  alt={`Profile of ${player.playerName}`}
                  style={myStyle.playerImage}
                />
                <div>
                  <p style={myStyle.playerName}>{player.playerName}</p>
                  <p style={myStyle.playerPoints}>{player.points} points</p>
                </div>
              </li>
            ))}
        </ul>
        <button style={myStyle.nextRoundButton} onClick={handleFormSubmit}>
          Goodbye 👋
        </button>
      </div>
    </Modal>
  );
};

export default GePopup;
