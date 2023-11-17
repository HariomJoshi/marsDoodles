const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// set PORT
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Connect to DB
const db = require("./config/database");
db.connect();

// Mount API
const user = require("./routes/user");
const { compareSync } = require("bcrypt");
const { constrainedMemory } = require("process");
const { time } = require("console");

app.use("/api/v1", user);

const reqPlayers = 2;
const gameRooms = {};
// const rightAns = {}; // stores the current right ans in a room

function createPlayer(
  playerId,
  playerName,
  points = 0,
  isAdmin = false,
  wordGuessed = false
) {
  return {
    playerId: playerId,
    playerName: playerName,
    points: points,
    isAdmin: isAdmin,
    wordGuessed: false,
    // timetaken: seconds
  };
}

// BUG : upon refreshing the page socket_id changes :> FIX: use userEmail instead of socket_id

io.on("connection", (socket) => {
  socket.on("joinUser", (data) => {
    console.log(data);
    const { userName, roomId } = data;
    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (socketsInRoom) {
      if (socketsInRoom.has(socket.id)) {
        // The socket ID is in the room
        console.log(`Socket ID ${socket.id} is ALREADY in the room ${roomId}`);
      } else {
        // The socket ID is not in the room and the room exists
        socket.join(roomId);
        const player = createPlayer(socket.id, userName, 0, false, false);
        console.log(
          `Socket ID ${socket.id} has JOINED the room ${roomId} as PLAYER`
        );

        // Add the player to the gameRooms
        gameRooms[roomId].players.push(player);

        // if player > threshold (min req to start the game)
        const noOfPlayersInRoom = io.sockets.adapter.rooms.get(roomId).size;
        if (noOfPlayersInRoom == reqPlayers && !gameRooms[roomId].gameStarted) {
          gameRooms[roomId].gameStarted = true;
          // start game
          io.sockets.in(roomId).emit("startGame", gameRooms[roomId]);
        }
      }
    } else {
      // The room doesn't exist
      console.log(`Room ${roomId} doesn't exist therefore creating one`); // connect with DB later
      socket.join(roomId);
      const player = createPlayer(socket.id, userName, 0, true, false);
      console.log(`Socket ID ${socket.id} has joined room ${roomId} as ADMIN`);
      // Create a new game room with the first admin
      gameRooms[roomId] = {
        admin: player,
        players: [player],
        rightAns: null,
        timer: {
          duration: 100,
          intervalId: null, // The intervalId: null serves as an indicator that no timer is currently running for the associated room
        },
        gameStarted: false,
      };
    }
    io.sockets.in(roomId).emit("userUpdate", gameRooms[roomId]); // only send that root data ie.gamerron.get(roomid)
  });
  socket.on("drawingData", (data) => {
    console.log(data);
    socket.broadcast.to(data.roomId).emit("drawOnWhiteboard", data);
  });

  // chatting data
  socket.on("message", (data) => {
    let obj = {};
    const { message, roomId, name } = data;
    if (gameRooms[roomId] && message === gameRooms[roomId].rightAns) {
      console.log("Got ans");

      obj = { message: "GUESSED THE RIGHT ANS", user: name };
      const playerIndex = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );

      if (playerIndex !== -1) {
        gameRooms[roomId].players[playerIndex].wordGuessed = true;
      }
    } else {
      obj = { message: message, user: name };
    }
    socket.broadcast.to(roomId).emit("messageResp", obj);
    let flag = false;
    for (const player of gameRooms[roomId].players) {
      if (player.playerId === socket.id) {
        continue;
      }
      if (!player.wordGuessed) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      io.sockets.in(roomId).emit("endGame", gameRooms[roomId]);
    }
  });

  socket.on("setDrawingName", (data) => {
    const { roomId, drawingName } = data;
    if (gameRooms[roomId]) {
      gameRooms[roomId].rightAns = drawingName;
    }
    console.log(gameRooms);
  });

  socket.on("getCorrectAns", (data) => {
    const { roomId, message } = data;
    let obj = {
      right: gameRooms[roomId] && message == gameRooms[roomId].rightAns,
    };
    socket.broadcast.to(roomId).emit("recieveCorrectAns", obj);
  });

  socket.on("disconnect", () => {
    // Loop through gameRooms to find the room where the user is associated
    for (const roomId in gameRooms) {
      const room = gameRooms[roomId];
      // Check if the user is in the room's players array
      const index = room.players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (index !== -1) {
        // Remove the user from the room's players array
        room.players.splice(index, 1);
        // Broadcast an updated user list or game state to the room
        io.to(roomId).emit("userUpdate", room);
        break;
      }
    }
  });
});

// Activate server
server.listen(PORT, () => {
  console.log(`marsDoodles is live at ${PORT}`);
});
