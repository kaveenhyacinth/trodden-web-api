const express = require("express");
const router = express.Router();

const {
  createTripController,
  getTripByNomadController,
} = require("../controllers/trip.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");

router.post("/new", isSignedIn, isAuthenticated, createTripController);
router.get("/n/:userId", isSignedIn, getTripByNomadController);

module.exports = router;
