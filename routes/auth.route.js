const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  signupController,
  signinController,
  signoutController,
} = require("../controllers/auth.controller");
const {
  checkEmail,
  checkUsername,
} = require("../middlewares/userAvailabilityChecker");

// Signup route
router.post(
  "/signup",
  [
    check("firstName")
      .isLength({ min: 2, max: 32 })
      .withMessage("Enter a value between 2 to 32 characters long"),
    check("lastName")
      .isLength({ min: 3, max: 32 })
      .withMessage("Enter a value between 2 to 32 characters long"),
    check("username")
      .isLength({ min: 4, max: 12 })
      .withMessage("Enter a value between 4 to 12 characters long"),
    check("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Enter a value between 6 to 12 characters long"),
    check("email").isEmail().withMessage("Enter a valid email"),
  ],
  checkEmail,
  checkUsername,
  signupController
);

// Signin route
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Enter a value between 6 to 12 characters long"),
  ],
  signinController
);

// Signout route
router.get("/signout", signoutController);

module.exports = router;
