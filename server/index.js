// Import necessary modules
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Filter = require("bad-words");
const filter = new Filter();
const words = require("./extra-words.json");
filter.addWords(...words);
// Create an Express app
const app = express();
// Set up environment variables and PORT
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Enable CORS for the specified origin, methods, and credentials
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
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
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST"],
  },
});

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
const db = require("./config/database");
db.connect();

// cloudinary connection
require("./config/cloudinary").cloudinaryConnect();

const cloudinary = require("cloudinary").v2;

app.post("/api/v1/getLink", async (req, res) => {
  try {
    // Get the image data from the request body
    const { imageData } = req.body;
    // Remove the "data:image/png;base64," prefix from the data URL
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    // Create a buffer from the base64 data
    const imageBuffer = Buffer.from(base64Data, "base64");
    // Generate a unique filename
    const filename = `drawing_${Date.now()}.png`;
    // Specify the path to save the file
    const filePath = path.join(__dirname, "uploads", filename);
    // Save the file to the specified path
    fs.writeFileSync(filePath, imageBuffer);

    cloudinary.uploader.upload(filePath, (error, result) => {
      if (!error) {
        fs.unlinkSync(filePath);
        res.json({ link: result.secure_url });
      } else {
        console.error("Error uploading to Cloudinary:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error saving canvas image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Mount API routes
const user = require("./routes/user");
app.use("/api/v1", user);

// Constants for the game
const reqPlayers = 3;
const maxRounds = 1;
const gameRooms = {};
const users = []; // for mouse pointer

// Function to create a player object
function createPlayer(
  playerId,
  playerName,
  points = 0,
  isAdmin = false,
  wordGuessed = false,
  isChatRestricted = false
) {
  return {
    playerId: playerId,
    playerName: null,
    points: points,
    isAdmin: isAdmin,
    wordGuessed: false,
    isChatRestricted: false,
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
        if (noOfPlayersInRoom == reqPlayers && !gameRooms[roomId].gameStarted) {
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
      console.log(`Socket ID ${socket.id} has joined room ${roomId} as ADMIN`);
      // Create a new game room with the first admin
      gameRooms[roomId] = {
        admin: player,
        players: [player],
        rightAns: null,
        turnNo: 0, // (index based)
        currRound: 1,
        rounds: maxRounds,
        timer: {
          duration: 100,
          intervalId: null,
        },
        gameStarted: false,
        currentPlayerIndex: 0,
        startTime: Date.now(),
        turnStartTime: null,
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
        socket.broadcast.to(data.roomId).emit("drawOnWhiteboard", data);
      }
    }
  });

  socket.on("amIAdmin", (data) => {
    const { roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      if (socket.id === gameRooms[roomId].admin.playerId) {
        socket.emit("yesYouAreAdmin");
      }
    }
  });

  // // timer runs out and not all players guess the correct answer
  socket.on("nextTurn", (data) => {
    console.log("NEXT TURN");
    const { roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      if (gameRooms[roomId].turnStartTime) {
        if (Date.now() - gameRooms[roomId].turnStartTime >= 90000) {
          // Broadcast an event indicating the end of the game
          io.sockets.in(roomId).emit("endGame", gameRooms[roomId].players);
          for (const player of gameRooms[roomId].players) {
            player.wordGuessed = false;
          }
          gameRooms[roomId].rightAns = null;
          // round end
          if (
            gameRooms[roomId].currentPlayerIndex <
            gameRooms[roomId].players.length - 1
          ) {
            console.log(
              "currentPlayerIndex < gameRooms[roomId].players.length-1"
            );
            gameRooms[roomId].currentPlayerIndex =
              (gameRooms[roomId].currentPlayerIndex + 1) %
              gameRooms[roomId].players.length;
            const currPlayer =
              gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
                .playerId;
            // Emit an event to the current player to send drawing data
            io.to(`${currPlayer}`).emit("sendDrawingData");
            for (const player of gameRooms[roomId].players) {
              if (player.playerId !== currPlayer) {
                io.to(player.playerId).emit("setDrawingControl", false);
              } else {
                io.to(`${currPlayer}`).emit("setDrawingControl", true);
              }
              player.wordGuessed = false;
            }
            socket.to(roomId).emit("setDrawingControl", false);
            // broadcast to everyone that the next player is choosing word (ADD)
          } else {
            console.log("else in endGame");
            if (gameRooms[roomId].currRound === gameRooms[roomId].rounds) {
              io.in(roomId).emit("finalGameEnd", gameRooms[roomId]);
              console.log("-*-*-GAME END-*-*-");
            } else {
              gameRooms[roomId].currRound++;
              gameRooms[roomId].currentPlayerIndex = 0;
              io.to(`${currPlayer}`).emit("sendDrawingData");
              for (const player of gameRooms[roomId].players) {
                if (player.playerId !== currPlayer) {
                  io.to(playerId).emit("setDrawingControl", false);
                } else {
                  io.to(`${currPlayer}`).emit("setDrawingControl", true);
                }
                player.wordGuessed = false;
              }
            }
          }
          gameRooms[roomId].turnStartTime = null;
        }
      }
    }
  });

  // Handling chat messages
  socket.on("message", (data) => {
    const { roomId, name } = data;
    let { message } = data;
    const cleanMessage = filter.clean(message);
    if (cleanMessage !== message) {
      // decrement the number of chance by one
      // show popup
      message = cleanMessage;
    }
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      if (message === gameRooms[roomId].rightAns) {
        console.log("Got ans");
        const playerIndex = gameRooms[roomId].players.findIndex(
          (player) => player.playerId === socket.id
        );
        if (playerIndex !== gameRooms[roomId].currentPlayerIndex) {
          // Broadcast a message indicating a correct guess
          io.in(roomId).emit("messageResp", {
            message: "Guessed",
            user: name,
            id: socket.id,
          });
        }

        if (
          playerIndex !== -1 &&
          playerIndex !== gameRooms[roomId].currentPlayerIndex
        ) {
          // Update player's wordGuessed status and calculate score
          gameRooms[roomId].players[playerIndex].wordGuessed = true;
          const score =
            90 -
            Math.floor((Date.now() - gameRooms[roomId].turnStartTime) / 1000);
          gameRooms[roomId].players[playerIndex].points += score;
          console.log("score: ", gameRooms[roomId].players[playerIndex].points);
        }
      } else {
        if (
          gameRooms[roomId] &&
          gameRooms[roomId].players &&
          message !== gameRooms[roomId].rightAns
        ) {
          const playerIndex = gameRooms[roomId].players.findIndex(
            (player) => player.playerId === socket.id
          );
          // Broadcast chat messages (excluding the sender) if the message is not the correct answer
          if (!gameRooms[roomId].players[playerIndex].isChatRestricted) {
            socket.broadcast.to(roomId).emit("messageResp", {
              message,
              user: gameRooms[roomId].players[playerIndex].playerName,
              id: socket.id,
            });
          }
        }
      }
      let flag = false;

      for (const player of gameRooms[roomId].players) {
        if (
          gameRooms[roomId] &&
          gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex] &&
          gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
            .playerId === player.playerId
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
        // next turn logic
        // gameGuessed = false for all
        // currentPlayerIndex++
        // rightAns = null
        for (const player of gameRooms[roomId].players) {
          player.wordGuessed = false;
        }
        gameRooms[roomId].rightAns = null;
        // round end
        if (
          gameRooms[roomId].currentPlayerIndex <
          gameRooms[roomId].players.length - 1
        ) {
          gameRooms[roomId].currentPlayerIndex =
            (gameRooms[roomId].currentPlayerIndex + 1) %
            gameRooms[roomId].players.length;
          const currPlayer =
            gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
              .playerId;
          // Emit an event to the current player to send drawing data
          io.to(`${currPlayer}`).emit("sendDrawingData");
          for (const player of gameRooms[roomId].players) {
            if (player.playerId !== currPlayer) {
              io.to(player.playerId).emit("setDrawingControl", false);
            } else {
              io.to(`${currPlayer}`).emit("setDrawingControl", true);
            }
            player.wordGuessed = false;
          }
          socket.to(roomId).emit("setDrawingControl", false);
          // broadcast to everyone that the next player is choosing word (ADD)
        } else {
          console.log("else in endGame");
          if (gameRooms[roomId].currRound === gameRooms[roomId].rounds) {
            io.in(roomId).emit("finalGameEnd", gameRooms[roomId]);
            console.log("-*-*-GAME END-*-*-");
          } else {
            gameRooms[roomId].currRound++;
            gameRooms[roomId].currentPlayerIndex = 0;
            io.to(`${currPlayer}`).emit("sendDrawingData");
            for (const player of gameRooms[roomId].players) {
              if (player.playerId !== currPlayer) {
                io.to(playerId).emit("setDrawingControl", false);
              } else {
                io.to(`${currPlayer}`).emit("setDrawingControl", true);
              }
              player.wordGuessed = false;
            }
          }
        }
      }
    }
  });

  socket.on("mouseMove", (data) => {
    // const {idx,name,x,y} = data;
    const { x, y, roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      const idx = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (idx !== -1) {
        const name = gameRooms[roomId].players[idx].playerName;
        const id = gameRooms[roomId].players[idx].playerId;
        // Broadcast the mouse movement data to other clients in the same room
        socket.broadcast.to(roomId).emit("mouseMove", { idx, name, x, y, id });
      }
    }
  });

  socket.on("clearRect", (roomId) => {
    console.log("received clear rect");
    io.in(roomId).emit("disableMouse", roomId);
  });

  socket.on("disableMouse", (data) => {
    const { roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      const idx = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (idx !== -1) {
        io.in(roomId).emit("disableMouse", idx);
      }
    }
  });

  socket.on("enableMouse", (data) => {
    const { roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      const idx = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (idx !== -1) {
        io.in(roomId).emit("enableMouse", idx);
      }
    }
  });

  socket.on("returnMyIdx", (roomId) => {
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      const idx = gameRooms[roomId].players.findIndex(
        (player) => player.playerId === socket.id
      );
      if (idx !== -1) {
        socket.emit(idx);
      }
    }
  });

  socket.on("kickUser", (data) => {
    const { id, roomId } = data;
    console.log(data);
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      if (socket.id === gameRooms[roomId].admin.playerId) {
        const socket = io.sockets.sockets.get(id);
        if (socket) {
          io.to(id).emit("youHaveBeenKicked");
          socket.leave(roomId);
          const index = gameRooms[roomId].players.findIndex(
            (player) => player.playerId === socket.id
          );
          if (index !== -1) {
            // Remove the user from the room's players array
            gameRooms[roomId].players.splice(index, 1);
            io.to(roomId).emit("userUpdate", gameRooms[roomId]);
          }
        } else {
          console.log(`Socket with ID ${id} not found`);
        }
      }
    }
  });

  socket.on("chatRestrict", (data) => {
    const { id, roomId } = data;
    if (gameRooms[roomId] && gameRooms[roomId].players) {
      if (socket.id === gameRooms[roomId].admin.playerId) {
        const playerIndex = gameRooms[roomId].players.findIndex(
          (player) => player.playerId === id
        );
        gameRooms[roomId].players[playerIndex].isChatRestricted = true;
        io.to(roomId).emit("userUpdate", gameRooms[roomId]);
      }
    }
  });

  // Handling setting drawing name event
  socket.on("setDrawingName", (data) => {
    const { roomId, drawingName } = data;
    if (
      gameRooms[roomId] &&
      gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex] &&
      gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
        .playerId === socket.id
    ) {
      socket.on("setUserData", (userData) => {
        users[socket.id] = userData;
        socket.broadcast.emit("userConnect", { id: socket.id, userData });
      });

      console.log(drawingName);
      gameRooms[roomId].rightAns = drawingName;
      if (drawingName !== "") {
        // Broadcast an event indicating the start of the game
        io.sockets.in(roomId).emit("clearCanvas", gameRooms[roomId]);
        gameRooms[roomId].turnStartTime = Date.now();
        io.sockets.in(roomId).emit("startGame", gameRooms[roomId]);
        console.log("Game Started");
        socket.emit("setDrawingControl", true);
        socket.to(roomId).emit("setDrawingControl", false);
        const data = {
          pName:
            gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
              .playerName,
          wSize: gameRooms[roomId].rightAns.length,
        };

        for (const player of gameRooms[roomId].players) {
          io.to(player.playerId).emit("currentPlayerData", data);
        }
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
        io.sockets.adapter.rooms.get(roomId) &&
        io.sockets.adapter.rooms.get(roomId).size === reqPlayers
      ) {
        const currPlayer =
          gameRooms[roomId].players[gameRooms[roomId].currentPlayerIndex]
            .playerId;
        // Emit an event to the current player to send drawing data
        io.to(`${currPlayer}`).emit("sendDrawingData");
        // broadcast to everyone that the next player is choosing word (ADD)
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
