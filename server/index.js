// Modules
const express = require("express");
const { app, server } = require("./lib/socket.js");

const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const path = require("path");
const __dirname = path.resolve();

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
