const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // http://localhost:5173
        // https://realtime-messaging-app-jet.vercel.app
        origin: ["http://localhost:5173"]
    }
})

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// Store online users
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Connect to a room when client emit an event
    socket.on('join', (room) => socket.join(room))

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id} `)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

module.exports = { io, app ,server, getReceiverSocketId };