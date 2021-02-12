const { validationResult } = require("express-validator");
const { getProfilebyId } = require("../services/ProfileService");

const getProfileByIdController = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Authorization @profile @extractor: " + token); // <- clg
  const result = await getProfilebyId(token);
  console.log("User @profile @extractor: " + result.nomad); // <- clg

  try {
    if (result.nomad === null) {
      return res.status(400).json(user);
    }
    req.profile = result.nomad;
    console.log("Debug profile @extractor: " + req.profile);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Couldn't find the user @extractor", err: error, success: false });
  }
};

const getProfileController = (req, res) => {
  if (req.profile === null)
    return res.status(400).json({ msg: "Couldn't find the user", err: error, success: false });

  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.status(200).json({ profile: req.profile, msg: "Got profile", success: true });
};

module.exports = {
  getProfileByIdController,
  getProfileController,
};
