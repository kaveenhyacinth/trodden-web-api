//#region IMPORTS
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");
const {
  getProfileByIdController,
  setUpProfileController,
  getIncomingBondRequestsController,
  getOutgoingBondRequestsController,
  placeBondRequestController,
  confirmBondRequestController,
  removeBondRequestController,
} = require("../controllers/profile.controller");
//#endregion

//#region Profile routes
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
router.put("/setup", isSignedIn, isAuthenticated, setUpProfileController);

//#endregion

//#region Bond routes

router.get(
  "/req/in/:userId",
  isSignedIn,
  isAuthenticated,
  getIncomingBondRequestsController
);
router.get(
  "/req/out/:userId",
  isSignedIn,
  isAuthenticated,
  getOutgoingBondRequestsController
);

router.post(
  "/req/new",
  isSignedIn,
  isAuthenticated,
  placeBondRequestController
);

router.patch(
  "/req/confirm",
  isSignedIn,
  isAuthenticated,
  confirmBondRequestController
);

router.delete("/req/rm/:userId/:requestId", removeBondRequestController);

//#endregion

module.exports = router;
