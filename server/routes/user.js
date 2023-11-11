const express = require("express");
const router = express.Router();

const {login,signup} = require("../controllers/Auth");
const {auth} = require("../middlewares/auth")
const {createRoom,getAllPublicRooms} = require("../controllers/Room")

router.post("/login",login);
router.post("/signup",signup);
router.post("/createRoom/:id",auth,createRoom)
router.get("/getAllPublicRooms",auth,getAllPublicRooms)

module.exports = router;