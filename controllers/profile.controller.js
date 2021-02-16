const { validationResult } = require("express-validator");
const { getProfilebyId, setupProfile } = require("../services/ProfileService");
const tokenDecoder = require("../middlewares/tokenDecoder");

// extract token and save current user to req.profile
const getProfileByIdController = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(400).json({
        msg: "Your token has expired or invalid",
        success: false,
      });
    const id = tokenDecoder(token);
    console.log("Id @ProfileController @getProfilebyId : " + id);
    const result = await getProfilebyId(id);
    if (result.nomad === null) {
      return res.status(400).json({
        msg: "Couldn't find the user @extractor",
        success: false,
      });
    }
    req.profile = result.nomad;
    console.log("Debug profile @extractor: " + req.profile);
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @extractor",
      err: error,
      success: false,
    });
  }
  // console.log("Authorization @profile @extractor: " + token); // <- clg
  // console.log("User @profile @extractor: " + result.nomad); // <- clg
};

// access to req.profile and get the current user profile
const getProfileController = (req, res) => {
  if (req.profile === null)
    return res
      .status(400)
      .json({ msg: "Couldn't find the user", err: error, success: false });

  return res
    .status(200)
    .json({ profile: req.profile, msg: "Got profile", success: true });
};

// setup profile info after a successful sign-up
const setUpProfileController = async (req, res) => {
  try {
    const result = await setupProfile(req.profile._id, req.body);
    return res
      .status(200)
      .json({ msg: "Updated successfully", result, success: true });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @set-up profile",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  getProfileByIdController,
  getProfileController,
  setUpProfileController,
};
