import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const SePopup = ({ isModalOpen, socket, roomId }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);
  const [toggleState, setToggleState] = useState(false);

  // Event listener for final game end
  socket.on("finalGameEnd", (data) => {
    setModalIsOpen(true);
  });

  // Styles for the modal and switch
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
      width: '100%',
      overflow: 'hidden',
      textAlign: 'left',
      maxWidth: '500px',
      boxSizing: 'border-box',
    },
    closeBtn: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      cursor: 'pointer',
      fontSize: '24px',
      color: '#333',
    },
    switchContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    switchLabel: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    switchSlider: {
      display: 'flex',
      alignItems: 'center',
    },
    switchSliderInner: {
      position: 'relative',
      width: '46px',
      height: '26px',
      borderRadius: '23px',
      backgroundColor: toggleState ? '#4BD763' : '#e6e6e6',
      transition: 'background-color 0.3s',
      marginLeft: toggleState ? '24px' : '0',
    },
    switchSliderBefore: {
      content: '',
      position: 'absolute',
      left: '2px',
      top: '2px',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      transform: toggleState ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 0.3s',
    },
  };

  // Function to handle toggle change
  const handleToggleChange = () => {
    setToggleState(!toggleState);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal isOpen={modalIsOpen} contentLabel="Score Board" style={myStyle}>
        <h1>Settings</h1>
      <div style={myStyle.closeBtn} onClick={closeModal}>&times;</div>
      <div style={myStyle.content}>
        <div style={myStyle.switchContainer}>
          {/* Label for the switch */}
          <div style={myStyle.switchLabel}>
            Show mouse pointer to others
          </div>
          {/* Switch slider */}
          <div style={myStyle.switchSlider}>
            {/* Inner part of the slider */}
            <div style={myStyle.switchSliderInner} onClick={handleToggleChange}>
              {/* White circle inside the slider */}
              <div style={myStyle.switchSliderBefore}></div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SePopup;
