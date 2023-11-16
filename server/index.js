// Import necessary modules
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Create an Express app
const app = express();

// Enable CORS for the specified origin, methods, and credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Use cookie parser middleware
app.use(cookieParser());

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a Socket.IO server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Set up environment variables and PORT
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
const db = require("./config/database");
db.connect();

// Mount API routes
const user = require("./routes/user");
app.use("/api/v1", user);

// Constants for the game
const reqPlayers = 3;
const gameRooms = {};

// Function to create a player object
function createPlayer(
  playerId,
  playerName,
  points = 0,
  isAdmin = false,
  wordGuessed = false
) {
  return {
    playerId: playerId,
    playerName: null,
    points: points,
    isAdmin: isAdmin,
    wordGuessed: false,
    // timetaken: seconds
  };
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  // Handling user join event
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
        // if player > threshold (min req to start the game)
        const noOfPlayersInRoom = io.sockets.adapter.rooms.get(roomId).size;
        if (
          noOfPlayersInRoom == reqPlayers &&
          !gameRooms[roomId].gameStarted
        ) {
          const playerIndex = gameRooms[roomId].players.findIndex(
            (player) => player.playerId === socket.id
          );
          if (playerIndex === -1) {
            io.to(`${socket.id}`).emit("roomLimitExceeded");
            console.log("Room limit Exceeded");
          }
        } else {
          socket.join(roomId);
          const player = createPlayer(socket.id, userName, 0, false, false);
          console.log(
            `Socket ID ${socket.id} has JOINED the room ${roomId} as PLAYER`
          );

          // Add the player to the gameRooms
          gameRooms[roomId].players.push(player);
        }
      }
    } else {
      // The room doesn't exist
      console.log(`Room ${roomId} doesn't exist, therefore creating one`); // connect with DB later
      socket.join(roomId);
      const player = createPlayer(socket.id, userName, 0, true, false);
      console.log(
        `Socket ID ${socket.id} has joined room ${roomId} as ADMIN`
      );
      // Create a new game room with the first admin
      gameRooms[roomId] = {
        admin: player,
        players: [player],
        rightAns: null,
        timer: {
          duration: 100,
          intervalId: null,
        },
        gameStarted: false,
        currentPlayerIndex: 0,
        startTime: Date.now(),
      };
    }
    io.sockets.in(roomId).emit("userUpdate", gameRooms[roomId]);
  });

  // Handling drawing data event
  socket.on("drawingData", (data) => {
    const { roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      const playerIndex = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (playerIndex === gameRooms[roomId].currentPlayerIndex) {
        // Broadcast the drawing data to other clients in the same room
        socket.broadcast
          .to(data.roomId)
          .emit("drawOnWhiteboard", data);
      }
    }
  });

  // Handling chat messages
  socket.on("message", (data) => {
    const { message, roomId, name } = data;
    if (
      gameRooms[roomId] &&
      message === gameRooms[roomId].rightAns
    ) {
      console.log("Got ans");
      const playerIndex = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (
        playerIndex !== gameRooms[roomId].currentPlayerIndex
      ) {
        // Broadcast a message indicating a correct guess
        io.in(roomId).emit("messageResp", { message: "Guessed", user: name });
      }

      if (
        playerIndex !== -1 &&
        playerIndex !== gameRooms[roomId].currentPlayerIndex
      ) {
        // Update player's wordGuessed status and calculate score
        gameRooms[roomId].players[playerIndex].wordGuessed = true;
        const score =
          100000 - (Date.now() - gameRooms[roomId].startTime);
        gameRooms[roomId].players[playerIndex].points +=
          score > 0 ? score : 1;
        console.log(
          "score: ",
          gameRooms[roomId].players[playerIndex].points
        );
      }
    } else {
      if (
        gameRooms[roomId] &&
        message !== gameRooms[roomId].rightAns
      ) {
        // Broadcast chat messages (excluding the sender) if the message is not the correct answer
        socket.broadcast
          .to(roomId)
          .emit("messageResp", { message, user: name });
      }
    }
    let flag = false;

    for (const player of gameRooms[roomId].players) {
      if (
        gameRooms[roomId] &&
        gameRooms[roomId].players[
          gameRooms[roomId].currentPlayerIndex
        ] &&
        gameRooms[roomId].players[
          gameRooms[roomId].currentPlayerIndex
        ].playerId === player.playerId
      ) {
        continue;
      }
      if (!player.wordGuessed) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      // Broadcast an event indicating the end of the game
      io.sockets.in(roomId).emit("endGame", gameRooms[roomId].players);
    }
  });

  // Handling setting drawing name event
  socket.on("setDrawingName", (data) => {
    const { roomId, drawingName } = data;
    if (
      gameRooms[roomId] &&
      gameRooms[roomId].players[
        gameRooms[roomId].currentPlayerIndex
      ] &&
      gameRooms[roomId].players[
        gameRooms[roomId].currentPlayerIndex
      ].playerId === socket.id
    ) {
      console.log(drawingName);
      gameRooms[roomId].rightAns = drawingName;
      if (drawingName !== "") {
        // Broadcast an event indicating the start of the game
        io.sockets.in(roomId).emit("startGame", gameRooms[roomId]);
        console.log("Game Started");
      }
    } else {
      console.error(`Room ${roomId} does not exist.`);
    }
  });

  // Handling get user name event
  socket.on("getUserName", (data) => {
    const { name, roomId } = data;
    if (gameRooms[roomId]) {
      const playerIndex = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (playerIndex !== -1) {
        // Update the user's name in the game room
        gameRooms[roomId].players[playerIndex].playerName = name;
      }
      let flag = false;
      for (const player of gameRooms[roomId].players) {
        if (player.playerName) {
        } else {
          flag = true;
          break;
        }
      }
      if (
        !flag &&
        io.sockets.adapter.rooms.get(roomId).size === reqPlayers
      ) {
        const currPlayer =
          gameRooms[roomId].players[
            gameRooms[roomId].currentPlayerIndex
          ].playerId;
        // Emit an event to the current player to send drawing data
        io.to(`${currPlayer}`).emit("sendDrawingData");
      } else {
        console.log("Permission to draw not valid");
      }
    }
  });

  // Handling user disconnect event
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

// Activate the server and listen on the specified PORT
server.listen(PORT, () => {
  console.log(`marsDoodles is live at ${PORT}`);
});
