const {
  signup,
  activate,
  signin,
} = require("../services/AuthenticationService");
const { validationResult } = require("express-validator");

/**
 * @description Sent verification mail on sign-up
 * @param {HTTP} req
 * @param {HTTP} res
 */
const signupController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  try {
    const { result, success } = await signup(req.body);
    console.log("@SignupController", result); //<-- clg
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Signup mail has been sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @signupController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * @description Register user account and activate
 * @param {HTTP} req
 * @param {HTTP} res
 */
const activateAccountController = async (req, res) => {
  try {
    const { result, success } = await activate(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "You have been registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @activateAccountController",
      err: error.message,
      success: false,
    });
  }
};

// TODO: signin a user
const signinController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  try {
    const { result, msg, token, success } = await signin(req.body);
    if (!success) {
      return res.status(400).json({ msg, success });
    }
    console.log("@SigninController", success); // <-- clg
    return (
      res
        .status(200)
        // .cookie("token", token, { expire: new Date() + 29 })
        .json({ msg, result, token, success })
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};

// TODO: signout
const signoutController = (req, res) => {
  try {
    req.profile = undefined;
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
  activateAccountController,
  signinController,
  signoutController,
};
