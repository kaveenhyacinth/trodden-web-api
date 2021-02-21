const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const upload = require("../middlewares/multerUploader");
const {
  getProfileByIdController,
  getProfileController,
  setUpProfileController,
} = require("../controllers/profile.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");

router.get(
  "/",
  isSignedIn,
  isAuthenticated,
  getProfileByIdController,
  getProfileController
);
router.put(
  "/setup",
  isSignedIn,
  isAuthenticated,
  upload.single("image"),
  setUpProfileController
);

module.exports = router;
