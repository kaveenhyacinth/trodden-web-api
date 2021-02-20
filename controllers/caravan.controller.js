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
    const caravanId = req.params["caravanId"];
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
    const ownerId = req.auth.id;
    const { result, success } = await getCaravansByOwner(ownerId);
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
      msg: "Caravans has been fetched successfully by owner",
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
    const userId = req.auth.id;
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
      msg: "Caravans has been fetched successfully by user",
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
 * @description Create a caravan
 * @param {Object} req
 * @param {Object} res
 */
const createCaravanController = async (req, res) => {
  try {
    const ownerId = req.auth.id;
    const { result, success } = await createCaravan(
      ownerid,
      req.file,
      req.body
    );
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
    const caravanId = req.params["caravanId"];
    const userId = req.auth.id;
    const { result, success } = await connectToCaravan(caravanId, userId);
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
    const caravanId = req.params["caravanId"];
    const ownerId = req.auth.id;
    const { result, success } = await updateCaravan(
      caravanId,
      ownerId,
      req.body
    );
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

/**
 * @description Delete a caravan
 * @param {Object} req
 * @param {Object} res
 */
const deleteCaravanController = async (req, res) => {};

module.exports = {
  createCaravanController,
  getCaravanByIdController,
  getCaravansByOwnerController,
  getCaravansByUserController,
  connectToCaravanController,
  updateCaravanController,
  deleteCaravanController,
};
