// Modules
const express = require("express");
const app = express();

const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

// Routes
const indexRoutes = require("./routes/index");



app.use(sessionConfig);
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./config/passportConfig");

app.use(cors())

// API
app.use("/api", indexRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
