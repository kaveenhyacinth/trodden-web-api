const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const tokenDecoder = require("../middlewares/tokenDecoder");
const {
  getProfileByIdController,
  getProfileController,
  setUpProfileController,
} = require("../controllers/profile.controller");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");

router.get(
  "/",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  getProfileByIdController,
  getProfileController
);
router.put(
  "/setup",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  setUpProfileController
);

module.exports = router;
