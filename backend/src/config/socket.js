const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("../middlewares/socketAuthMiddleware");
require("dotenv").config();

const app = express()
const serverSocket = http.createServer(app)

const io = new Server(serverSocket,{
    cors: {
        origin: process.env.CLIENT_URL, // client url
        credentials: true // to allow sending cookies
    }
})

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware)

//store the online users : this is for storing online users
const userSocketMap = {} // {userId: socketId}

io.on("connection", (socket) => {
    console.log("✅ A user connected", socket.user.name);// get it from socket middleware

    const userId = socket.userId

    userSocketMap[userId] = socket.id
    if (!socket.user) {
        console.log("⚠️ No user attached to socket");
        return;
    }

    // io.emit() is used to send events to all connected clients
    // event name  is  getOnlineUsers you can call this anything  
    // take all keys and send it back to the clients and you can listen for this event
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // with socket.on() we can listen to events from specific clients
    socket.on("disconnect", () => {
        console.log(" ❌ A user disconnected", socket.user.name);
        delete userSocketMap[userId] // or use socket.user._id
        // update online users list when a user disconnects
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });

    
});


module.exports =  {app, serverSocket }