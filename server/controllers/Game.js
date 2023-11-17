const User = require("../models/User");
const Room = require("../models/Room");
const Game = require("../models/Game");

exports.addGame = async (req, res) => {
  try {
    const { score, rank, userEmail } = req.body;
    // console.log("body of request: " + req.body);

    let game = await Game.create({
      // creation of users
      score,
      rank,
    });

    const objId = new mongoose.Types.ObjectId(game.id);
    await User.updateOne(
      {
        email: userEmail,
      },
      {
        $push: {
          games: objId,
        },
      }
    );
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

exports.getAllGames = async (req, res) => {
  const { email } = req;
  try {
    User.findOne({ email: email })
      .populate({ path: "games", model: "games" })
      .then((list) => {
        console.log(list);
        res.status(400).json({
          games: list.games,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch games",
    });
    console.log(error);
  }
};
