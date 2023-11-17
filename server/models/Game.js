const mongoose = require("mongoose");
// creating a game model and linking it to the user schema
const gameModel = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
    },
  },
  {
    // adding timestamps for sorting the data according to the date of creation
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameModel);
