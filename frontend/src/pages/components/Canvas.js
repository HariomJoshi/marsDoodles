import { useRef, useEffect, useState } from "react";

function Canvas({
  selectedColor,
  selectedLineWidth,
  selectedLineDash,
  roomId,
  socket,
  name,
  email,
}) {
  const [x0, setx0] = useState("");
  const [y0, sety0] = useState("");
  const [x1, setx1] = useState("");
  const [y1, sety1] = useState("");
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [visible, setVisible] = useState(false);
  // const [roomId, setRoomId] = useState("");
  // const [canvasHeight, setCanvasHeight] = useState('');
  // const [canvasWidth, setCanvasWidth] = useState('');
  const data = { roomId, name, email };
  function joinRoom() {
    const data = { userName: "user", roomId };
    console.log(data);
    socket.emit("joinUser", data);
  }

  const style = {
    display: "flex",
    border: "2px solid #3498db",
    borderRadius: "8px",
    backgroundColor: "#ecf0f1",

  };

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");
    joinRoom();
  }, []);

  useEffect(() => {
    const dashArray = selectedLineDash.split(",").map(Number);
    ctxRef.current.setLineDash(dashArray);
    ctxRef.current.lineWidth = selectedLineWidth;
    ctxRef.current.strokeStyle = selectedColor;
  }, [selectedLineDash, selectedLineWidth, selectedColor, socket]);

  useEffect(() => {
    socket.on("userJoined", (data) => {
      console.log(data);
    });
    socket.on("drawOnWhiteboard", (data) => {
      console.log("received");
      console.log(data);
      const { x0, x1, y0, y1, lineDash, lineWidth, color } = data;

      // set options
      try {
        const dashArray = lineDash.split(",").map(Number);
        ctxRef.current.setLineDash(dashArray);
      } catch (err) {}
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.strokeStyle = color;

      // drawing path
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x0, y0);
      console.log(x0);
      ctxRef.current.lineTo(x1, y1);
      ctxRef.current.stroke();
      ctxRef.current.closePath();
    });
  }, [socket]);

  function onMouseDown(e) {
    setVisible(true);
    ctxRef.current.beginPath();
    setx0(e.nativeEvent.offsetX);
    sety0(e.nativeEvent.offsetY);

    ctxRef.current.moveTo(x0, y0);
  }

  function onMouseUp() {
    setVisible(false);
    ctxRef.current.closePath();
  }

  function onMouseMove(e) {
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
      });
    }
    setx0(x1);
    sety0(y1);
  }

  return (
    <div>
      {/* <input
        style={inputStyle}
        type="text"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button style={buttonStyle} onClick={() => joinRoom()}>
        JOIN

      </button> */}
      <canvas
        style={style}
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
