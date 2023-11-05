const mongoose = require('mongoose');
const sendMail = require('../utils/mailSender')

const userSchema = new mongoose.Schema({
    name:{
         type: String,
         required:true,
    },
    imageUrl: {
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    games: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Game"
        }
    ],
    password:{
        type:String,
        required:true,
    }
})

userSchema.post("save", async function(next){
    try {
        await sendMail(this.email,"Welcome to Mars Doodles", `<h1>Welcome ${this.name}<h1/>`);
        next();
    } catch (error) {
        console.log("Error occurred while sending mail (models/user.js)");
    }
})

module.exports = mongoose.model("User",userSchema);