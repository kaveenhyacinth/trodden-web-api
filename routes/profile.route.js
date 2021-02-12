const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getProfileByIdController,
  getProfileController,
} = require("../controllers/profile.controller");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");

router.get("/", getProfileByIdController, isSignedIn, isAuthenticated, getProfileController);

module.exports = router;
