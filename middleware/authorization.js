const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = async( req, res, next) => {
    const token = req.header("token");

    try {

        if(!token){
            return res.status(403).json("Not authorized");
    }

    const verify = jwt.verify(token,process.env.jwtSecret)

   req.user = verify.user;
    next();
    } catch (error) {
        return res.status(403).json("Not authorized");
    }
};