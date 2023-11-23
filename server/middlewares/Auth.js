const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.body.jwt);
    const token = req.body.jwt;

    if (!token) {
      return res.status(406).json({
        success: false,
        message: "Token mil nahi raha hai",
      });
    }

    //verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      //   console.log(payload);
      req.user = payload; // to use in next middlewares
    } catch (error) {
      return res.status(402).json({
        success: false,
        message: `Token is invalid: ${error}`, // send user to the login page
      });
    }
    next(); // goes to next middleware
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: `Something went wrong while verifying the token: ${error}`,
    });
  }
};
