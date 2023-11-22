import { useRef, useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FaShareSquare } from "react-icons/fa";
import ShareButtons from "./ShareButtons";
import "./Canvas.css";
import { BASE_URL } from "../helper";

function Canvas({
  selectedColor,
  selectedLineWidth,
  selectedLineDash,
  roomId,
  socket,
  name,
  email,
  objType,
}) {
  const img = new Image();
  const [x0, setx0] = useState("");
  const [y0, sety0] = useState("");
  const [x1, setx1] = useState("");
  const [y1, sety1] = useState("");
  const [url, setUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eraser, setEraser] = useState(false);
  const data = { roomId, name, email };

  function joinRoom() {
    const data = { userName: "user", roomId };
    console.log(data);
    socket.emit("joinUser", data);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");
    joinRoom();

    // img.addEventListener("load", function () {
    //   console.log("Image loaded successfully");
    // });

    // img.addEventListener("error", function () {
    //   console.error("Error loading image");
    // });
  }, []);

  useEffect(() => {
    const dashArray = selectedLineDash.split(",").map(Number);
    ctxRef.current.setLineDash(dashArray);
    ctxRef.current.lineWidth = selectedLineWidth;
    ctxRef.current.strokeStyle = selectedColor;
  }, [selectedLineDash, selectedLineWidth, selectedColor, socket]);

  useEffect(() => {
    socket.on("clearRect", (data) => {
      console.log("Clear whiteboard received");
      clear();
    });
    socket.on("userJoined", (data) => {
      console.log(data);
    });
    socket.on("drawOnWhiteboard", (data) => {
      console.log("received");
      console.log(data);
      const { x0, x1, y0, y1, lineDash, lineWidth, color, eraser, objType } =
        data;
      if (eraser) {
        setEraser(true);
      } else {
        setEraser(false);
      }
      try {
        const dashArray = lineDash.split(",").map(Number);
        ctxRef.current.setLineDash(dashArray);
      } catch (err) {}
      if (objType === "marker") {
        ctxRef.current.lineWidth = lineWidth;
        ctxRef.current.strokeStyle = color;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x0, y0);
        ctxRef.current.lineTo(x1, y1);
        ctxRef.current.stroke();
        ctxRef.current.closePath();
      } else if (eraser) {
        ctxRef.current.lineWidth = 25;
        ctxRef.current.strokeStyle = "rgb(236,240,241)";
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x0, y0);
        ctxRef.current.lineTo(x1, y1);
        ctxRef.current.stroke();
        ctxRef.current.closePath();
      } else {
        if (objType === "pencil") {
          img.src =
            "https://t4.ftcdn.net/jpg/03/71/65/29/360_F_371652941_9hxPir8cXeOqiEgPli6csDIxLmhhvIIv.jpg";
        } else if (objType === "multicolour") {
          img.src =
            "https://cdn.pixabay.com/photo/2016/12/15/20/21/texture-1909992_640.jpg";
        }
        ctxRef.current.beginPath();
        const pattern = ctxRef.current.createPattern(img, "repeat");
        const x = x0;
        const y = y0;
        ctxRef.current.arc(x, y, 5, 0, 2 * Math.PI);
        ctxRef.current.fillStyle = pattern;
        ctxRef.current.fill();
        ctxRef.current.closePath();
      }
    });
  }, [socket]);

  function onMouseDown(e) {
    setVisible(true);
    if (objType === "marker") {
      ctxRef.current.strokeStyle = selectedColor;
      ctxRef.current.beginPath();
      setx0(e.nativeEvent.offsetX);
      sety0(e.nativeEvent.offsetY);
      ctxRef.current.moveTo(x0, y0);
    } else if (objType === "eraser") {
      ctxRef.current.strokeStyle = "rgb(236,240,241)";
      ctxRef.current.lineWidth = 25;
      ctxRef.current.beginPath();
      setx0(e.nativeEvent.offsetX);
      sety0(e.nativeEvent.offsetY);
      ctxRef.current.moveTo(x0, y0);
    } else {
      if (objType === "pencil") {
        img.src =
          "https://t4.ftcdn.net/jpg/03/71/65/29/360_F_371652941_9hxPir8cXeOqiEgPli6csDIxLmhhvIIv.jpg";
      } else if (objType === "multicolour") {
        img.src =
          "https://cdn.pixabay.com/photo/2016/12/15/20/21/texture-1909992_640.jpg";
      }
    }
  }

  function onMouseUp() {
    setVisible(false);
    ctxRef.current.closePath();
  }

  function onMouseMove(e) {
    if (objType === "marker") {
      ctxRef.current.strokeStyle = selectedColor;
      ctxRef.current.lineWidth = selectedLineWidth;
      setx1(e.nativeEvent.offsetX);
      sety1(e.nativeEvent.offsetY);
      if (visible) {
        ctxRef.current.lineTo(x1, y1);
        ctxRef.current.stroke();
        socket.emit("drawingData", {
          roomId,
          x0,
          x1,
          y0,
          y1,
          lineDash: selectedLineDash,
          lineWidth: selectedLineWidth,
          color: selectedColor,
          eraser: false,
          objType,
        });
      }
      setx0(x1);
      sety0(y1);
    } else if (visible && objType === "eraser") {
      setx1(e.nativeEvent.offsetX);
      sety1(e.nativeEvent.offsetY);
      if (visible) {
        ctxRef.current.lineTo(x1, y1);
        ctxRef.current.stroke();
        socket.emit("drawingData", {
          roomId,
          x0,
          x1,
          y0,
          y1,
          lineDash: selectedLineDash,
          lineWidth: selectedLineWidth,
          color: selectedColor,
          eraser: true,
          objType: objType,
        });
      }
      setx0(x1);
      sety0(y1);
    } else if (visible) {
      if (objType === "pencil") {
        img.src =
          "https://t4.ftcdn.net/jpg/03/71/65/29/360_F_371652941_9hxPir8cXeOqiEgPli6csDIxLmhhvIIv.jpg";
      } else if (objType === "multicolour") {
        img.src =
          "https://cdn.pixabay.com/photo/2016/12/15/20/21/texture-1909992_640.jpg";
      }
      ctxRef.current.beginPath();
      const pattern = ctxRef.current.createPattern(img, "repeat");
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      ctxRef.current.arc(x, y, 5, 0, 2 * Math.PI);
      ctxRef.current.fillStyle = pattern;
      ctxRef.current.fill();
      ctxRef.current.closePath();
      socket.emit("drawingData", {
        roomId,
        x0: x,
        x1,
        y0: y,
        y1,
        lineDash: selectedLineDash,
        lineWidth: selectedLineWidth,
        color: selectedColor,
        eraser: false,
        objType: objType,
      });
    }
  }

  const MyComponent = () => {
    useEffect(() => {
      const saveDrawing = () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL("image/png");
        if (imageData) {
          setImageData(imageData);
        }
      };

      const intervalId = setInterval(saveDrawing, 500);
      return () => clearInterval(intervalId);
    }, []);
  };

  function captureCanvasImage() {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    return imageData;
  }

  function getLink() {
    const imageData = captureCanvasImage();

    fetch(`${BASE_URL}/getLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Backend response:", result);
        setUrl(result.link);
      })
      .catch((error) => {
        console.error("Error sending image to backend:", error);
      });
  }

  function clear() {
    ctxRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function download() {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div>
        <button
          onClick={getLink}
          style={{
            background: "#4CAF50", // Green color
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px", // Add some margin to separate the buttons
          }}
        >
          <FaShareSquare style={{ marginRight: "5px" }} />
          Generate
        </button>
        <ShareButtons shareUrl={url} />
        <button
          onClick={download}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <AiOutlineDownload size={24} color="#fff" />
        </button>
        <button
          onClick={() => {
            socket.emit("clearRect", { roomId });
          }}
        >
          Clear canvas
        </button>
        {/* <button onClick={}>Rectangle</button> */}
      </div>
      <canvas
        style={{
          display: "flex",
          border: "2px solid #3498db",
          borderRadius: "8px",
          backgroundColor: "#ecf0f1",
        }}
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      />
    </div>
  );
}

export default Canvas;
