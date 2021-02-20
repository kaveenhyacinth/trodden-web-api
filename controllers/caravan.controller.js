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
      msg: "Internal server error @getMemoByUserController",
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
const getCaravansByOwnerController = async (req, res) => {};

/**
 * @description Get caravans where a specific user is connected
 * @param {Object} req
 * @param {Object} res
 */
const getCaravansByUserController = async (req, res) => {};

/**
 * @description Create a caravan
 * @param {Object} req
 * @param {Object} res
 */
const createCaravanController = async (req, res) => {};

/**
 * @description Connect with a caravan
 * @param {Object} req
 * @param {Object} res
 */
const connectToCaravanController = async (req, res) => {};

/**
 * @description Update a caravan meta
 * @param {Object} req
 * @param {Object} res
 */
const updateCaravanController = async (req, res) => {};

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
