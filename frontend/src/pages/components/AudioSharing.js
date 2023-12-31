import React, { useState, useEffect } from "react";

const AudioRecorder = ({ socket, roomId }) => {
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [receivedAudio, setReceivedAudio] = useState(null);
  const [isItMyTurn, setIsItMyTurn] = useState(false);

  useEffect(() => {
    // Set up audio stream
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => setAudioStream(stream))
      .catch((error) => console.error("Error accessing microphone:", error));

    // Set up socket listeners for receiving audio
    socket.on("audioData", (data) => {
      setReceivedAudio({ audioUrl: data.audioUrl, key: Date.now() });
    });
    socket.on("setDrawingControl", (data) => {
      setIsItMyTurn(data);
    });
  }, [mediaRecorder, isRecording, socket, receivedAudio]);

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    } else {
      // Start recording
      const chunks = [];
      const recorder = new MediaRecorder(audioStream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Send audio data to the server
        socket.emit("audioData", { audioBlob, audioUrl, room: roomId });

        // Reset chunks for the next recording
        chunks.length = 0;
      };

      setMediaRecorder(recorder);
      recorder.start();
    }

    // Toggle the recording state
    setIsRecording(!isRecording);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isItMyTurn && (
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: isRecording ? "#ff5252" : "#4caf50",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleRecordToggle}
        >
          {isRecording ? "DONE" : "Audio CLUE🎙️"}
        </button>
      )}
      {receivedAudio && (
        <div style={{ marginLeft: "10px", fontSize: "12px", width: "100%" }}>
          <audio
            key={receivedAudio.key}
            controls
            autoPlay
            style={{ width: "100%" }}
            hidden
          >
            <source src={receivedAudio.audioUrl} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
