// SePopup.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import MfPopup from "./MakeFigurePopup";

const SePopup = ({ isModalOpen, socket, roomId, openSettingsModal }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);
  const [toggleState, setToggleState] = useState(true);
  const [myPlayerIdx, setMyPlayerIdx] = useState(null);
  const [mOpen, setMOpen] = useState(false);

  useEffect(() => {
    setModalIsOpen(isModalOpen);
  }, [isModalOpen]);

  // // Event listener for final game end
  // socket.on("finalGameEnd", (data) => {
  //   socket.emit("returnMyIdx", roomId);
  //   socket.on("returnMyIdx", (idx) => {
  //     setMyPlayerIdx(idx);
  //     socket.emit('disableMouse', { idx: myPlayerIdx });
  //   });
  // });

  // Styles for the modal and switch
  const myStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      position: "relative",
      backgroundColor: "#f9f9f9",
      padding: "30px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
      width: "100%",
      overflow: "hidden",
      textAlign: "left",
      maxWidth: "500px",
      boxSizing: "border-box",
      margin: "10px",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      cursor: "pointer",
      fontSize: "24px",
      color: "#333",
    },
    switchContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    switchLabel: {
      fontSize: "18px",
      marginBottom: "10px",
    },
    switchSlider: {
      display: "flex",
      alignItems: "center",
    },
    switchSliderInner: {
      position: "relative",
      width: "46px",
      height: "26px",
      borderRadius: "23px",
      backgroundColor: toggleState ? "#4BD763" : "#e6e6e6",
      transition: "background-color 0.3s",
      marginLeft: toggleState ? "24px" : "0",
    },
    switchSliderBefore: {
      content: "",
      position: "absolute",
      left: "2px",
      top: "2px",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      transform: toggleState ? "translateX(20px)" : "translateX(0)",
      transition: "transform 0.3s",
    },
  };

  const handleToggleChange = () => {
    setToggleState((prevState) => !prevState);

    // Emit enableMouseMove or disableMouse event based on the toggle state
    const eventName = toggleState ? "disableMouse" : "enableMouse";
    socket.emit(eventName, { roomId });
  };

  // Function to close the modal
  const closeModal = () => {
    openSettingsModal(false);
  };

  return (
    <Modal isOpen={modalIsOpen} contentLabel="Score Board" style={myStyle}>
      <h1>Settings</h1>
      <div style={myStyle.closeBtn} onClick={closeModal}>
        &times;
      </div>
      <div style={myStyle.content}>
        <div style={myStyle.switchContainer}>
          {/* Label for the switch */}
          <div style={myStyle.switchLabel}>Show mouse pointer to others</div>
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
      <div style={myStyle.content}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: "1",
          }}
        >
          <div style={myStyle.switchLabel}>Make Shapes</div>
          <button
            style={{
              backgroundColor: "#3498DB",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
              boxSizing: "border-box",
            }}
            onClick={() => {
              setMOpen(true);
            }}
          >
            Open
          </button>
        </div>
      </div>
      <MfPopup
        isModalOpen={mOpen}
        socket={socket}
        roomId={roomId}
        setMOpen={setMOpen}
      />
    </Modal>
  );
};

export default SePopup;
