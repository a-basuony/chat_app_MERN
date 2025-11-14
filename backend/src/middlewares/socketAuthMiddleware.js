const jwt = require("jsonwebtoken");

const User = require("../model/user.model");
require("dotenv").config();



// (socket, next) => socket: is the user connected from the client frontend (socket connection)
 const socketAuthMiddleware = async (socket, next) => {
 try {
    // extract token from http-only cookies
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies found"));

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

      
    if (!token) {
        console.log("Socket connection rejected: Token required: No token provided");
      return next(new Error("Unauthorized - Authentication error: Token required"));
    }
    
    //2 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
         console.log("Socket connection rejected: User not found");
      return next(new Error("Unauthorized Invalid token"));
    }
    //3 find the user from db
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log("Socket authenticated for user:", user.name, user._id);

    next();

 } catch (error) {
    console.log("Authentication error:", error.message);
    next(new Error(`Unauthorized - Authentication error: ${error.message}`));
    res.status(401).json({ message: "Unauthorized: Internal server error", error: error.message });
 }
};

module.exports = { socketAuthMiddleware };