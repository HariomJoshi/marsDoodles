const bcrypt = require("bcrypt");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async(req,res) => {
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(401).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }
        const existingUser = await User.findOne({email});


        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            });
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }  catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:'Error in hashing password'
            })
        }
        
        let user = await User.create({ // const user or let user ? 
            name,email,password:hashedPassword
        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully'
        })
        
    } catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later'
        })
    }
}

// login
exports.login = async(req, res) => {
    try{
        //data fetch
        const {email, password} = req.body;
        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }
        
        // check for registered user
        const user = await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Email or password is incorrect" // "User is not registered"
            })
        }
        
        

        const payload = {
            email:user.email,
            id:user._id,
            password:user.password
        }

        // verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                                expiresIn:"2h"
                                })
            // user = user.toObject();
            // to remove password from the response being send to the client
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // + 30 days
                httpOnly: true,
                secure: true
            }
            res.cookie('jwt', token, options);
            res.status(200).json({
                success:true,
                user,
                jwt_token:token,
                message:"User logged in successfully"
            });
        } else{
            //password doesn't match 
            return res.status(403).json({
                success:false,
                message:"Email or password is incorrect" //password doesn't match 
            })
        }

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure"
        })
    }
}