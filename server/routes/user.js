const express = require("express");
const router = express.Router();

const {login,signup} = require("../controllers/Auth");
const {auth} = require("../middlewares/auth")

router.post("/login",login);
router.post("/signup",signup);

// add isAllowed in game :)
router.get("/gamePage",auth, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the HOME PAGE"
    })
})

module.exports = router;