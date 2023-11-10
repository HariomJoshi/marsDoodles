
const express = require('express');
const app = express();
const http = require("http");
const {Server} = require("socket.io")
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

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
        socket.join(data)
        console.log(`${socket.id} has joined ${data}`)
    });
    socket.on("drawingData", (data) => {
        console.log(data)
        const { roomId, x0, x1, y0, y1 } = data;
        console.log(data.roomId);
        socket.broadcast.to(roomId).emit("drawOnWhiteboard", {
            x0, x1, y0, y1
          });
    });
});

app.use("/api/v1", user);

// Activate server
app.listen(PORT, () => {
  console.log(`marsDoodles is live at ${PORT}`);
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
