const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["public","private"],
    required:true
  },
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  participants:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
