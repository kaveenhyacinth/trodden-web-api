const express = require("express");
const router = express.Router();

const { createTripController } = require("../controllers/trip.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");

router.post("/new", isSignedIn, isAuthenticated, createTripController);

module.exports = router;
