const { signup, signin } = require("../services/AuthenticationService");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Signup a user
const signupController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  try {
    const result = await signup(req.body);
    console.log("@SignupController", result); //<-- clg
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// signin a user
const signinController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  try {
    const { msg, token, success } = await signin(req.body);
    if (!success) {
      return res.status(400).json({ msg, success });
    }
    console.log("@SigninController", success); // <-- clg
    return res
      .status(200)
      .cookie("token", token, { expire: new Date() + 29 })
      .json({ msg, success, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// signout
const signoutController = (req, res) => {
  try {
    return res.clearCookie("token").json({
      msg: "User has signout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  signupController,
  signinController,
  signoutController,
};
