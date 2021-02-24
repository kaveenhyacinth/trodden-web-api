const { validationResult } = require("express-validator");
const { getProfilebyId, setupProfile } = require("../services/ProfileService");

// extract token and save current user to req.profile
const getProfileByIdController = async (req, res) => {
  const userId = req.params.userId;
  try {
    const { result, success } = await getProfilebyId(userId);
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
      msg: "Profile been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getProfileByIdController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description setup profile info after a successful sign-up
 * @param {Object} req HTTP request
 * @param {Object} res HTTP respone
 */
const setUpProfileController = async (req, res) => {
  try {
    const result = await setupProfile(req.body, req.file);
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
  setUpProfileController,
};
