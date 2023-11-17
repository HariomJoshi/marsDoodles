import { useRef, useEffect, useState } from "react";
import { AiOutlineDownload } from 'react-icons/ai';
import ShareButtons from "./ShareButtons";
import "./Canvas.css";

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
  const [url, setUrl] = useState("");
  const [image, setImage] = useState();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [visible, setVisible] = useState(false);
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

      try {
        const dashArray = lineDash.split(",").map(Number);
        ctxRef.current.setLineDash(dashArray);
      } catch (err) {}
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.strokeStyle = color;

      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x0, y0);
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

  const MyComponent = () => {
    useEffect(() => {
      const saveDrawing = () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');
        if(imageData){
          setImage(imageData)
        }
      };

      const intervalId = setInterval(saveDrawing, 500);
      return () => clearInterval(intervalId);
    }, []);
  }

  // Add this function inside your Canvas component
function captureCanvasImage() {
  const canvas = canvasRef.current;
  const imageData = canvas.toDataURL('image/png');
  return imageData;
}


  function getLink() {
    const imageData = captureCanvasImage();
  
    // Send the imageData to your backend
    fetch('http://localhost:4000/api/v1/getLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Backend response:', result);
  
        // Update the state or perform any other actions with the returned link
        setUrl(result.link);
      })
      .catch(error => {
        console.error('Error sending image to backend:', error);
      });
  }
  

  function download(){
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div>
      <div>
        <button onClick={getLink}> BUTTON </button>
        <ShareButtons shareUrl={url}/>
        <button onClick={download} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <AiOutlineDownload size={24} color="#fff" /> 
        </button>
      </div>
      <canvas
        style={{ display: "flex", border: "2px solid #3498db", borderRadius: "8px", backgroundColor: "#ecf0f1" }}
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
