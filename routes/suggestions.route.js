const express = require("express");
const router = express.Router();
const suggestions = require("../controllers/suggestions.controller");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");

router.get(
  "/i/caravans/:userId",
  isSignedIn,
  isAuthenticated,
  suggestions.getCaravansByInterestsController
);

router.get(
  "/i/nomads/:userId",
  // isSignedIn,
  // isAuthenticated,
  suggestions.getNomadsByInterestsController
);

module.exports = router;
