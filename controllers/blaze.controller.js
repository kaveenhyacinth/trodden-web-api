const {
  createBlaze,
  getRecentBlazes,
  getBlazesByCaravan,
  getBlazeById,
  markAsGoingToBlaze,
  updateBalze,
  deleteBlaze,
} = require("../services/CommunityService");

// TODO: Create new blaze
const createBlazeController = async (req, res) => {};

// TODO: Get blaze by date period
const getRecentBlazesController = async (req, res) => {};

// TODO: Get blaze by id
const getBlazeByIdController = async (req, res) => {};

// TODO: Get blazes by caravan
const getBlazesByCaravanController = async (req, res) => {};

// TODO: Update a blaze
const updateBlazeController = async (req, res) => {};

// TODO: Mark as going to a blaze
const markAsGoingToBlazeController = async (req, res) => {};

// TODO: Delete a blaze
const deleteBlazeController = async (req, res) => {};

module.exports = {
  createBlazeController,
  getBlazeByIdController,
  getBlazesByCaravanController,
  getRecentBlazesController,
  updateBlazeController,
  markAsGoingToBlazeController,
  deleteBlazeController,
};
