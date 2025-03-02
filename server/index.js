// Modules
const express = require("express");
const { app, server } = require("./lib/socket.js");

const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

// Routes
const indexRoutes = require("./routes/index");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");

// Middlewares
app.use(sessionConfig);
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./config/passportConfig");

app.use(cors())

// API
app.use("/api", indexRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);



server.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));
