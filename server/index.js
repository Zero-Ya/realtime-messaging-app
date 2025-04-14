// Modules
const express = require("express");
const { app, server } = require("./lib/socket.js");

const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Routes
const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const groupRoutes = require("./routes/group");

// Middlewares
app.use(sessionConfig);
app.use(passport.session());

app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

require("./config/passportConfig");

app.use(
    cors({
        origin: "https://realtime-messaging-app-jet.vercel.app/",
        credentials: true,
    })
)

// API
app.use("/api", indexRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);



server.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));
