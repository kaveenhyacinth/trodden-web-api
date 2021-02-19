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
 * @description Create a caravan
 * @param {Object} req
 * @param {Object} res
 */
const createCaravanController = async (req, res) => {};

/**
 * @description Get a caravan by its id
 * @param {Object} req
 * @param {Object} res
 */
const getCaravanByIdController = async (req, res) => {};

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
