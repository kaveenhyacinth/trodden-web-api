const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");

require("dotenv").config();
require("./db/connect");

// Init express app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Import routes
const authRoute = require("./routes/auth.route");

// Routes
app.use("/api/auth", authRoute);

// Server instance
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`⚡ [server] APP IS RUNNING ON PORT ${PORT}`));

module.exports = app  //for testing