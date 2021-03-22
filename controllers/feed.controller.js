const { fetchFeed } = require("../services/ContentService");
const {
  isSignedIn,
  isAuthenticated,
} = require("../middlewares/authenticationChecker");

const fetchFeedController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await fetchFeed(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching feed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Feed have been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @fetchFeedController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  fetchFeedController,
};
