const bcrypt = require("bcrypt");
const User = require("../models/User");
const Room = require("../models/Room");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { type } = req.body;
    // console.log(type)
    const { email, id } = req.user;

    const user = await User.findOne({ email });
    const userID = user._id;

    const participants = [user._id];

    //check if such room exists then only create

    let room = await Room.create({
      roomId,
      admin: userID,
      participants,
      type,
    });

    console.log(`Room Created successfully with admin ${id}`);
    return res.status(200).json({
      success: true,
      message: `Room Created successfully with admin ${id}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while creating room: ${err}`,
    });
  }
};

exports.joinRoom = async (req, res) => {
  try {
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while joining room: ${err}`,
    });
  }
};

exports.getAllPublicRooms = async (req, res) => {
  try {
    let rooms = await Room.find({ type: "public" });
    return res.status(200).json({
      data: rooms,
      success: true,
      message: `Fetched all rooms`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while fetching all public rooms ${error}`,
    });
  }
};
