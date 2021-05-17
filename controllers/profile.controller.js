const { validationResult } = require("express-validator");
const {
  getProfilebyId,
  getTribeList,
  setupProfile,
  updateUserIntersts,
} = require("../services/ProfileService");
const bonds = require("../services/CommunityService");

const getProfileByIdController = async (req, res) => {
  const userId = req.params.userId;
  try {
    const { result, success } = await getProfilebyId(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Couldn't get user",
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
      result: error,
      success: false,
    });
  }
};

const getTribeListController = async (req, res) => {
  const userId = req.params.userId;
  try {
    const { result, success } = await getTribeList(userId);
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
      msg: "Got tribe list",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getTribeListController",
      result: error,
      success: false,
    });
  }
};

const setUpProfileController = async (req, res) => {
  try {
    const result = await setupProfile(req.body);
    return res
      .status(200)
      .json({ msg: "Updated successfully", result, success: true });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @set-up profile",
      result: error,
      success: false,
    });
  }
};

const getIncomingBondRequestsController = async (req, res) => {
  try {
    const { result, success } = await bonds.getIncomingBondRequests(
      req.params.userId
    );
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: "Got incoming bond requests",
    });
  } catch (error) {
    console.log("fatel error", error);
    return res.status(500).json({
      msg: "Internal server error while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const getOutgoingBondRequestsController = async (req, res) => {
  try {
    const { result, success } = await bonds.getOutgoingBondRequests(
      req.params.userId
    );
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: "Got outgoing bond requests",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server erro while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const placeBondRequestController = async (req, res) => {
  try {
    const { result, success } = await bonds.placeBondRequest(req.body);
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: "Places bond request",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server erro while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const confirmBondRequestController = async (req, res) => {
  try {
    const { result, success } = await bonds.confirmBondRequest(req.body);
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: "Confirmed bond request",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server erro while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const removeBondRequestController = async (req, res) => {
  try {
    const { result, success } = await bonds.removeBondRequest(
      req.params.requestId
    );
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: "Removed bond request",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server erro while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const removeBondFromTribeController = async (req, res) => {
  try {
    console.log("params in remove bond", req.params);
    const { result, success } = await bonds.removeBondFromTribe(
      req.params.userId,
      req.params.bondId
    );
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res.status(200).json({
      result,
      success,
      msg: result,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server erro while processing on bond requests actions",
      result: error,
      success: false,
    });
  }
};

const updateNomadInterestsController = async (req, res) => {
  try {
    const { result, success } = await updateUserIntersts(
      req.body.userId,
      req.body.interests
    );
    if (!success)
      return res.status(400).json({
        result,
        success,
        msg: result,
      });
    return res
      .status(200)
      .json({ msg: "Updated successfully", result, success: true });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @updateNomadInterestsController",
      result: error,
      success: false,
    });
  }
};

module.exports = {
  getProfileByIdController,
  getTribeListController,
  setUpProfileController,
  getIncomingBondRequestsController,
  getOutgoingBondRequestsController,
  placeBondRequestController,
  confirmBondRequestController,
  removeBondRequestController,
  removeBondFromTribeController,
  updateNomadInterestsController,
};
