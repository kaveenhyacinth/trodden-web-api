const { suggestCaravansByInterests } = require("../services/SuggestionService");
const {
  createCaravan,
  getCaravanById,
  getCaravansByOwner,
  getCaravansByUser,
  connectToCaravan,
  updateCaravan,
  deleteCaravan,
} = require("../services/CommunityService");

/**
 * @description Get a caravan by its id
 * @param {Object} req
 * @param {Object} res
 */
const getCaravanByIdController = async (req, res) => {
  try {
    const caravanId = req.params.caravanId;
    const { result, success } = await getCaravanById(caravanId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching the caravan",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravan has been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getCaravanByIdController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Get a caravan by its owner
 * @param {Object} req
 * @param {Object} res
 */
const getCaravansByOwnerController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await getCaravansByOwner(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching the caravans by owner",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravans have been fetched successfully based on owner",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getCaravansByOwnerController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Get caravans where a specific user is connected
 * @param {Object} req
 * @param {Object} res
 */
const getCaravansByUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await getCaravansByUser(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching the caravans by user",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravans have been fetched successfully based on user",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getCaravansByUserController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Get caravans by interests
 * @param {Object} req
 * @param {Object} res
 */
const getCaravansByInterestsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await suggestCaravansByInterests(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg:
          "Something went wrong while fetching caravan suggestions by interests",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg:
        "Caravans suggesstions have been fetched successfully based on interests",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getCaravansByInterestsController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Create a caravan
 * @param {Object} req
 * @param {Object} res
 */
const createCaravanController = async (req, res) => {
  try {
    const { result, success } = await createCaravan(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while creating the caravan",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravan has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @createCaravanController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Connect with a caravan
 * @param {Object} req
 * @param {Object} res
 */
const connectToCaravanController = async (req, res) => {
  try {
    const { result, success } = await connectToCaravan(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while connecting to the caravan",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Connecting to the caravan has been succeeded",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @connectToCaravanController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Update a caravan meta
 * @param {Object} req
 * @param {Object} res
 */
const updateCaravanController = async (req, res) => {
  try {
    const { result, success } = await updateCaravan(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while updating the caravan",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravan has been updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @updateCaravanController",
      err: error,
      success: false,
    });
  }
};

// TODO: update caravan image controller

/**
 * @description Delete a caravan
 * @param {Object} req
 * @param {Object} res
 */
const deleteCaravanController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const caravanId = req.params.caravanId;
    const { result, success } = await deleteCaravan(userId, caravanId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while deleting the caravan",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Caravan has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteCaravanController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  createCaravanController,
  getCaravanByIdController,
  getCaravansByOwnerController,
  getCaravansByUserController,
  connectToCaravanController,
  updateCaravanController,
  deleteCaravanController,
  getCaravansByInterestsController,
};
