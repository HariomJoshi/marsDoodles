const User = require("../models/User");
const Room = require("../models/Room");
const Game = require("../models/Game");
const mongoose = require("mongoose");

exports.addGame = async (req, res) => {
  try {
    const { score, rank, email } = req.body;

    let game = await Game.create({
      // creation of users
      score,
      rank,
    });
    // console.log("Object id " + game._id);
    const objId = new mongoose.Types.ObjectId(game._id);
    //checking if the users exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with email: ${email}`,
      });
    }
    await User.updateOne({ email: email }, { $push: { games: objId } });
    return res.status(200).json({
      success: true,
      message: `Game added successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while adding game: ${error}`,
    });
  }
};

// Here, we have to make functions for addition, updation, deletion
// and reading of previous games
// currently only for updation and reading

exports.getAllGames = async (req, res) => {
  try {
    const { userEmail } = req.body;
    // console.log("Email is: " + userEmail);
    const user = await User.findOne({
      email: userEmail,
    }).populate({
      path: "games",
      model: Game,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log(user);
    res.status(200).json({
      games: user.games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch games",
    });
  }
};
