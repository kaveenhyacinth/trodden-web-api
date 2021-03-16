const SuggestionService = require("../services/SuggestionService");

/**
 * @description Get caravans by interests
 * @param {Object} req
 * @param {Object} res
 */
const getCaravansByInterestsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      result,
      success,
    } = await SuggestionService.suggestCaravansByInterests(userId);
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

const getNomadsByInterestsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await SuggestionService.suggestNomdsByInterests(
      userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg:
          "Something went wrong while fetching nomad suggestions by interests",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg:
        "Nomads suggesstions have been fetched successfully based on interests",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getNomadssByInterestsController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  getCaravansByInterestsController,
  getNomadsByInterestsController,
};
