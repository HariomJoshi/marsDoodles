import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const MfPopup = ({ isModalOpen, socket, roomId, openClose, setMOpen }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);

  useEffect(() => {
    if (isModalOpen) {
      setModalIsOpen(true);
      setMOpen(true);
    }
  }, [isModalOpen]);

  // State variables for coordinates and shapes
  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [radius, setRadius] = useState("");
  const [sideLength, setSideLength] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [majorAxis, setMajorAxis] = useState("");
  const [minorAxis, setMinorAxis] = useState("");
  const [trapeziumInput, setTrapeziumInput] = useState("");

  const headingStyle = {
    textAlign: "center",
    color: "#3498DB",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
  };

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
      maxWidth: "fit-content",
      width: "100%",
      overflow: "scroll",
      textAlign: "center",
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      cursor: "pointer",
      fontSize: "24px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: "20px",
    },
    input: {
      flex: 1,
      marginLeft: "10px",
      padding: "12px",
      margin: "5px 0",
      border: "1px solid #3498DB",
      borderRadius: "4px",
      fontSize: "12px",
      boxSizing: "border-box",
    },
    button: {
      backgroundColor: "#3498DB",
      color: "white",
      padding: "12px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "bold",
      transition: "background-color 0.3s",
      margin: "10px 20px",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      width: "50px", // Adjust as needed
    },
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setMOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setModalIsOpen(false);
    setMOpen(false);
  };

  // Function to handle plotting for each shape
  const handlePlot = (shape) => {
    switch (shape) {
      case "circle":
        console.log("Plotting Circle", { xCoordinate, yCoordinate, radius });
        socket.emit("makeCircle", { xCoordinate, yCoordinate, radius, roomId });
        closeModal();
        break;
      case "square":
        socket.emit("makeSquare", {
          xCoordinate,
          yCoordinate,
          sideLength,
          roomId,
        });
        closeModal();
        break;
      case "rectangle":
        socket.emit("makeRectangle", {
          xCoordinate,
          yCoordinate,
          height,
          width,
          roomId,
        });
        closeModal();
        break;
      case "ellipse":
        socket.emit("makeEllipse", {
          xCoordinate,
          yCoordinate,
          majorAxis,
          minorAxis,
          roomId,
        });
        closeModal();
        break;
      case "trapezium":
        const [x1, y1, x2, y2, x3, y3, x4, y4] = trapeziumInput
          .split(",")
          .map((val) => val.trim());
        socket.emit("makeTrapezium", {
          x1,
          y1,
          x2,
          y2,
          x3,
          y3,
          x4,
          y4,
          roomId,
        });
        closeModal();
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={myStyle}
    >
      <form onSubmit={handleFormSubmit} style={myStyle.form}>
        <h1 style={headingStyle}>Plot Shapes</h1>
        <div style={myStyle.form}>
          <div style={myStyle.inputContainer}>
            <h3>Set Coordinates:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="xCoordinate"
              placeholder="X"
              value={xCoordinate}
              onChange={(e) => setXCoordinate(e.target.value)}
            />
            <input
              style={myStyle.input}
              type="text"
              id="yCoordinate"
              placeholder="Y"
              value={yCoordinate}
              onChange={(e) => setYCoordinate(e.target.value)}
            />
          </div>
          <div style={myStyle.inputContainer}>
            <h3>Circle:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="radius"
              placeholder="Radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
            <button
              style={myStyle.button}
              type="button"
              onClick={() => handlePlot("circle")}
            >
              Plot Circle
            </button>
          </div>
          <div style={myStyle.inputContainer}>
            <h3>Square:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="sideLength"
              placeholder="Side Length"
              value={sideLength}
              onChange={(e) => setSideLength(e.target.value)}
            />
            <button
              style={myStyle.button}
              type="button"
              onClick={() => handlePlot("square")}
            >
              Plot Square
            </button>
          </div>
          <div style={myStyle.inputContainer}>
            <h3>Rectangle:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="height"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              style={myStyle.input}
              type="text"
              id="width"
              placeholder="Width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <button
              style={myStyle.button}
              type="button"
              onClick={() => handlePlot("rectangle")}
            >
              Plot Rectangle
            </button>
          </div>
          <div style={myStyle.inputContainer}>
            <h3>Ellipse:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="majorAxis"
              placeholder="Major Axis Length"
              value={majorAxis}
              onChange={(e) => setMajorAxis(e.target.value)}
            />
            <input
              style={myStyle.input}
              type="text"
              id="minorAxis"
              placeholder="Minor Axis Length"
              value={minorAxis}
              onChange={(e) => setMinorAxis(e.target.value)}
            />
            <button
              style={myStyle.button}
              type="button"
              onClick={() => handlePlot("ellipse")}
            >
              Plot Ellipse
            </button>
          </div>
          <div style={myStyle.inputContainer}>
            <h3>Trapezium:</h3>
            <input
              style={myStyle.input}
              type="text"
              id="trapeziumInput"
              placeholder="Enter coordinates (x1, y1, x2, y2, x3, y3, x4, y4)"
              value={trapeziumInput}
              onChange={(e) => setTrapeziumInput(e.target.value)}
            />
            <button
              style={myStyle.button}
              type="button"
              onClick={() => handlePlot("trapezium")}
            >
              Plot Trapezium
            </button>
          </div>
        </div>
        <button style={myStyle.button} type="submit">
          Done
        </button>
      </form>
    </Modal>
  );
};

export default MfPopup;
