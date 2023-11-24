import React from "react";
import Modal from "react-modal";

const ScrollableModal = ({ isOpen, closeModal, children }) => {
  // console.log("Reached scrollable modal " + isOpen);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Add overlay color
        },
        // here do the changes to make it translucent
        content: {
          overflowY: "auto",
          maxHeight: "90%",
          padding: "0",
          top: "20%",
          left: "30%",
          right: "auto",
          borderRadius: "10px",
          transform: "translate(-20%, -20%)",
          width: "60%",
          height: "90%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          // opacity: "0.8",
          backgroundColor:
            "rgba(255, 255, 255, 0.2)" /* Semi-transparent white background */,
          backdropFilter:
            "blur(10px)" /* Apply a blur effect to simulate frosted glass */,
          borderRadius:
            "8px" /* Optional: add rounded corners for a softer look */,
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.1)" /* Add a subtle box shadow */,
        },
      }}
    >
      {children}
      {/* <button onClick={closeModal}>Close Modal</button> */}
    </Modal>
  );
};

export default ScrollableModal;
