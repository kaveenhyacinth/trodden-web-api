const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getProfileByIdController,
  getProfileController,
  setUpProfileController
} = require("../controllers/profile.controller");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");

router.get("/", getProfileByIdController, isSignedIn, isAuthenticated, getProfileController);
router.put("/setup", getProfileByIdController, isSignedIn, isAuthenticated, setUpProfileController);

module.exports = router;
