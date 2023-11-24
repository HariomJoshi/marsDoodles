const express = require("express");
const router = express.Router();
require("dotenv").config();

const { login, signup } = require("../controllers/Auth");
const { auth } = require("../middlewares/Auth");
const {
  createRoom,
  joinRoom,
  getAllPublicRooms,
} = require("../controllers/Room");
const mailSender = require("../utils/mailSender");
const { getAllGames, addGame } = require("../controllers/Game");

router.post("/login", login);
router.post("/signup", signup);
router.post("/createRoom/:id", auth, createRoom);
router.post("/joinRoom/:id", auth, joinRoom);
router.post("/getAllPublicRooms", auth, getAllPublicRooms);
router.post("/sendInvitationMail", auth, async (req, res) => {
  try {
    const { link, email } = req.body;
    mailSender(
      email,
      "Invitation to play on bit2byte!",
      `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Invitation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #3498db;
    }

    a {
      color: white;
      text-decoration: none;
    }

    p {
      margin-bottom: 20px;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <h1>Game Invitation</h1>
    <p>Hello,</p>
    <p>You have been invited to play a game on bit2byte! Join the fun and click the link below:</p>
    <a class="button" href="${
      `${process.env.FRONTEND_URL}/pages/game-screen/` + link
    }" target="_blank">Play Now</a>
    <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
    <p>${`${process.env.FRONTEND_URL}/pages/game-screen/` + link}</p>
    <p>Have a great time playing!</p>
  </div>
</body>

</html>

    `
    );
    return res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully`,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/allGames", auth, getAllGames);
router.post("/addGame", auth, addGame);

module.exports = router;
