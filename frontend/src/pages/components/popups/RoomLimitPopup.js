import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const RlPopup = ({ isModalOpen, socket,roomId }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);

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
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
      maxWidth: '400px',
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
    form: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0', // Adjusted margin for spacing
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    button: {
      backgroundColor: '#3498DB',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  socket.on("roomLimitExceeded",()=>{
    console.log("roomLimitExceeded")
    setModalIsOpen(true)
  })

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/")
    setModalIsOpen(false);
  };


  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={myStyle}
    >
      <form onSubmit={handleFormSubmit} style={myStyle.form}>
        <h1>Room Limit Exceeded.</h1>
        <h3>You may join other public rooms or create a new private room.</h3>
        <button type="submit" style={myStyle.button}>
          Okay
        </button>
      </form>
    </Modal>
  );
};

export default RlPopup;