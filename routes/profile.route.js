//#region IMPORTS
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {upload} = require("../jobs/FileStorageEngine")
const {
  getProfileByIdController,
  setUpProfileController,
} = require("../controllers/profile.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");
//#endregion

/**
 * @description Get current user by id
 * @name get/ownProfile
 */
router.get(
  "/my/:userId",
  isSignedIn,
  isAuthenticated,
  getProfileByIdController
);

/**
 * @description Get any user by id
 * @name get/userProfile
 */
router.get("/user/:userId", getProfileByIdController);

/**
 * @description Update profile info after signup
 * @name put/setupProfile
 */
router.put(
  "/setup",
  isSignedIn,
  upload.single("image"),
  isAuthenticated,
  setUpProfileController
);

module.exports = router;
