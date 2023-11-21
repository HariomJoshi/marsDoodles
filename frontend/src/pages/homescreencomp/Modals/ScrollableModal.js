import React from "react";
import Modal from "react-modal";

const ScrollableModal = ({ isOpen, closeModal, children }) => {
  console.log("Reached scrollable modal " + isOpen);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Add overlay color
        },
        content: {
          top: "20%",
          left: "30%",
          right: "auto",
          borderRadius: "10px",
          transform: "translate(-20%, -20%)",
          width: "60%",
          height: "90%",
          backgroundColor: "white",
        },
      }}
    >
      {children}
      <button onClick={closeModal}>Close Modal</button>
    </Modal>
  );
};

export default ScrollableModal;
