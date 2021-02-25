const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

//#region IMPORTS
const {
  signupController,
  activateAccountController,
  signinController,
  refreshTokenController,
  signoutController,
} = require("../controllers/auth.controller");
const {
  checkEmail,
  checkUsername,
} = require("../middlewares/userAvailabilityChecker");
//#endregion

/**
 * @description Sign-up user
 * @name post/signup
 */
router.post(
  "/signup",
  [
    check("firstName")
      .trim()
      .isLength({ min: 2, max: 32 })
      .withMessage("Enter a value between 2 to 32 characters long"),
    check("lastName")
      .trim()
      .isLength({ min: 3, max: 32 })
      .withMessage("Enter a value between 2 to 32 characters long"),
    check("username")
      .trim()
      .isLength({ min: 4, max: 12 })
      .withMessage("Enter a value between 4 to 12 characters long"),
    check("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Enter a value between 6 to 12 characters long"),
    check("email")
      .trim()
      .isEmail()
      .toLowerCase()
      .withMessage("Enter a valid email"),
  ],
  checkEmail,
  checkUsername,
  signupController
);

/**
 * @description activate and register user
 * @name post/activate
 */
router.post("/activate", activateAccountController);

/**
 * @description Sign-in user
 * @name post/signin
 */
router.post(
  "/signin",
  [
    check("email")
      .trim()
      .isEmail()
      .toLowerCase()
      .withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Enter a value between 6 to 12 characters long"),
  ],
  signinController
);

/**
 * @description refresh token
 * @name post/refresh-token
 */
router.post("/refresh-token", refreshTokenController);

// FIXME: Signout route
router.get("/signout", signoutController);

module.exports = router;
