const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });
require("./db/connect");

// Init express app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'))
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Import routes
const authRoute = require("./routes/auth.route");
const profileRoute = require("./routes/profile.route");
const interestRoute = require("./routes/interest.route");
const memoryRoute = require("./routes/memory.route");
const caravanRoute = require("./routes/caravan.route");

// Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/interests", interestRoute);
app.use("/api/memories", memoryRoute);
app.use("/api/caravan", caravanRoute);

// Server instance
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`⚡ [server] APP IS RUNNING ON PORT ${PORT}`)
);
