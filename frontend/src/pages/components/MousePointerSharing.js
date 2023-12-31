import React, { useEffect, useState } from 'react';

const MousePointerSharing = ({ socket, roomId }) => {
  const [playerDetails, setPlayerDetails] = useState([]);
  const [myPlayerIdx, setMyPlayerIdx] = useState(null);
  const [toggleState, setToggleState] = useState(false)

  useEffect(() => {
    // Emit event to get the player's index
    socket.emit("returnMyIdx", roomId);
  
    // Listen for the response and update the state
    socket.on("returnMyIdx", (idx) => {
      setMyPlayerIdx(idx);
    });
  }, [socket, roomId]);


  useEffect(() => {
    const initialPlayerDetails = Array(3).fill().map(() => ({
      x: 0,
      y: 0,
      name: "",
      visible: true,
      profilePhoto: 'https://placekitten.com/20/20',
    }));
    setPlayerDetails(initialPlayerDetails);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(()=>{
    socket.on("disableMouse", (idx) => {
      console.log("disable mouse")
      setPlayerDetails((prevDetails) => {
        const newDetails = [...prevDetails];
        // Disable mouse movement for the specified player
        newDetails[idx] = { ...newDetails[idx], visible: false };
        return newDetails;
      });
    });

    socket.on("enableMouse", (idx) => {
      console.log("enable mouse")
      setPlayerDetails((prevDetails) => {
        const newDetails = [...prevDetails];
        // Enable mouse movement for the specified player
        newDetails[idx] = { ...newDetails[idx], visible: true };
        return newDetails;
      });
    });
  },[socket])

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    socket.emit('mouseMove', { x: clientX, y: clientY, roomId: roomId });
    // console.log(socket.id, e.clientX, e.clientY);
  };

  useEffect(() => {
    if (socket) {
      socket.on('mouseMove', (data) => {
        setPlayerDetails((prevDetails) => {
          const newDetails = [...prevDetails];
          const { idx, name, x, y,id } = data;
          newDetails[idx] = { ...newDetails[idx], x, y, name,id };
          return newDetails;
        });
      });
    }
  }, [socket]);

  return (
    <div className="mousePointerSharing">
      {playerDetails.map((player, index) => (
        <div key={index}>
          {player.visible &&  myPlayerIdx !== index && player.id !== undefined && (
            <div
              style={{
                position: 'absolute',
                left: player.x,
                top: player.y,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={`https://robohash.org/${player.id}.png`}
                alt={`${player.name}'s profile`}
                style={{ width: '45px', height: '45px', borderRadius: '50%' }}
              />
              <div
                style={{
                  background: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  padding: '2px',
                  borderRadius: '3px',
                  marginTop: '2px',
                  fontSize: '10px',
                }}
              >
                {player.name}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MousePointerSharing;
