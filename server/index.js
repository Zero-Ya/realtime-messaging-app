// Modules
import express from "express";
// const express = require("express");

import { app, server } from "./lib/socket.js";
// const { app, server } = require("./lib/socket.js");

import passport from "passport";
// const passport = require("passport");
import sessionConfig from "./config/sessionConfig.js";
// const sessionConfig = require("./config/sessionConfig");
import cors from "cors";
// const cors = require("cors");
import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser");

import path from "path";
// const path = require("path");
const __dirname = path.resolve();

import dotenv from "dotenv";
dotenv.config();

// Routes
import indexRoutes from "./routes/index.js";
// const indexRoutes = require("./routes/index");
import chatRoutes from "./routes/chat.js";
// const chatRoutes = require("./routes/chat");
import messageRoutes from "./routes/message.js";
// const messageRoutes = require("./routes/message");
import groupRoutes from "./routes/group.js";
// const groupRoutes = require("./routes/group");

// Middlewares
app.use(sessionConfig);
app.use(passport.session());

app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

import "./config/passportConfig";

app.use(
    cors({
        // https://realtime-messaging-app-jet.vercel.app
        // http://localhost:5173
        origin: "https://realtime-messaging-app-jet.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

// API
app.use("/api", indexRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    })
}


server.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));
