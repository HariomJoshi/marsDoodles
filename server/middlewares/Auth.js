const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }

        //verify the token
        try{
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload; // to use in next middlewares
        } catch(error){
            return res.status(401).json({
                success:false, 
                message:`Token is invalid: ${error}` // send user to the login page
            })
        }
        next(); // goes to next middleware

    } catch(error){
        return res.status(401).json({
            success:false,
            message:`Something went wrong while verifying the token: ${error}`
        })
    }
}