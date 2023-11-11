const express = require('express');
const cookieParser = require('cookie-parser');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true, 
}));

app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
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
    socket.join(data);
    console.log(`${socket.id} has joined ${data}`);
  });
  socket.on("drawingData", (data) => {
    console.log(data);
    socket.broadcast.to(data.roomId).emit("drawOnWhiteboard", data);
  });
});

// hariom's
const { chats } = require("./data/data");
app.get("/game/chats", (req, res) => {
  res.send(chats);
});

app.get("/game/chats/:id", (req, res) => {
  console.log(req.params.id);
  const singlechat = chats.find((c) => c._id === req.params.id);
  res.send(singlechat);
});

// Activate server
server.listen(PORT, () => {
  console.log(`marsDoodles is live at ${PORT}`);
});
