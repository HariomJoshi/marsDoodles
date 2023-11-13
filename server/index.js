const { getUser, addUser, getUsersInRoom } = require("./utils/roomUsers");
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

app.use("/api/v1", user);

io.on("connection", (socket) => {
  socket.on("joinUser", (data) => {
    socket.join(data.roomId);
    console.log(`${socket.id} has joined ${data.roomId}`);
    const user = {
      // name , userId , roomId, isHost, isPresenter, socketID
      name: data.name,
      roomId: data.roomId,
      email: data.email,
      isHost: false,
      isPresenter: false,
      socketID: socket.id,
    };

    addUser(user);
  });
  socket.on("drawingData", (data) => {
    console.log(data);
    socket.broadcast.to(data.roomId).emit("drawOnWhiteboard", data);
  });

  // chatting data
  socket.on("message", (data) => {
    const { message, roomId, name } = data;
    // const name = getUser(userId).name;

    socket.broadcast.to(roomId).emit("messageResp", { message, user: name });
  });

  socket.on("onlineusers", (roomId) => {
    const users = getUsersInRoom(roomId);
    console.log("Filtered array: " + users.length);
    socket.broadcast.to(roomId).emit("currentOnlineUsers", users);
  });
});

// Activate server
server.listen(PORT, () => {
  console.log(`marsDoodles is live at ${PORT}`);
});
