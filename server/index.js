// Create app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

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
