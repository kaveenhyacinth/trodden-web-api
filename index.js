const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });
require("./db/connect");

// Init express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(cors());

// Import routes
const authRoute = require("./routes/auth.route");
const profileRoute = require("./routes/profile.route");
const interestRoute = require("./routes/interest.route");
const memoryRoute = require("./routes/memory.route");
const caravanRoute = require("./routes/caravan.route");
const blazeRoute = require("./routes/blaze.route");

// Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/interests", interestRoute);
app.use("/api/memories", memoryRoute);
app.use("/api/caravan", caravanRoute);
app.use("/api/blaze", blazeRoute);

/** Unauthorized error handler */
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res
      .status(401)
      .json({ result: null, success: false, msg: "Invalid or expired token" });
  }
});

/** Not Found error handler */
app.all("*", (req, res) => {
  res.status(404).json({
    result: "404",
    success: false,
    msg: "404! page not found"
  });
});

// Server instance
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `⚡ [server] Server is running on ${PORT} in ${process.env.NODE_ENV} mode`
  )
);
