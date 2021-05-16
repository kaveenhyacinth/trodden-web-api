const { fetchFeed, fetchFeedByHashTag } = require("../services/ContentService");

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

const fetchFeedByHashTagController = async (req, res) => {
  try {
    const tag = `#${req.params.tag.trim()}`;
    const { result, success } = await fetchFeedByHashTag(tag);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching feed by hashtags",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Feed have been fetched successfully based on hashtags",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @fetchFeedByHashTagsController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  fetchFeedController,
  fetchFeedByHashTagController,
};
