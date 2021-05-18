const { validationResult } = require("express-validator");
const {
  signup,
  activate,
  signin,
  refresh,
} = require("../services/AuthenticationService");

/**
 * @description Sent verification mail on sign-up
 * @param {HTTP} req
 * @param {HTTP} res
 * @async
 */
const signupController = async (req, res) => {
  const isError = validationResult(req);
  if (!isError.isEmpty())
    return res.status(422).json({ result: isError.array(), success: false });

  try {
    const { result, success } = await signup(req.body);
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
 * @async
 */
const activateAccountController = async (req, res) => {
  try {
    const { result, success } = await activate(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Couldn't register user. Please Try again later",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "You have been registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      result: null,
      success: false,
      msg: "Internal server error @activateAccountController",
    });
  }
};

/**
 * @description Sign-in user
 * @param {HTTP} req
 * @param {HTTP} res
 * @async
 */
const signinController = async (req, res) => {
  const isError = validationResult(req);
  if (!isError.isEmpty())
    return res.status(422).json({ result: isError.array(), success: false });

  try {
    const { result, success } = await signin(req.body);
    if (!success) return res.status(400).json({ result, success });

    return res.status(200).json({
      result,
      success,
      msg: "Singned in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      result,
      success,
      msg: "Internal server error @signinController",
    });
  }
};

/**
 * @description Send a new sign token and new refresh token
 * @param {HTTP} req
 * @param {HTTP} res
 */
const refreshTokenController = (req, res) => {
  const { result, success } = refresh(req.body);
  if (!success) {
    return res.status(401).json({
      result,
      success,
      msg: result,
    });
  }
  return res.status(200).json({
    result,
    success,
    msg: "New tokens",
  });
};

// FIXME: signout
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
  refreshTokenController,
  signoutController,
};
