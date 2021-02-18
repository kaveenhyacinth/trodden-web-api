const {
  getMemos,
  getMemoByUser,
  createMemo,
  updateMemo,
  deleteMemo,
  commentOnMemo,
  heatOnMemory,
  checkAndCreateHashtags
} = require("../services/ContentService");

/**
 * @description Get all the memories which belong to the current user
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const getMemosController = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { result, success } = await getMemos(ownerId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching your memories",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Memories has been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getMemosController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Get all the memories which belong to a specific user
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const getMemoByUserController = async (req, res) => {
  try {
    const userId = req.params["userId"];
    const { result, success } = await getMemoByUser(userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching user memories",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Memories has been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getMemoByUserController",
      err: error,
      success: false,
    });
  }
};

const checkAndCreateHashtagsController = (req, res) => {
  try {
    const {content} = req.body;
    const result = checkAndCreateHashtags(content);
    // checkAndCreateHashtags(content);
    return res.status(200).json({
      msg: "Checking tags",
      result
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @checkAndCreateHashtagsController",
      err: error,
      success: false,
    }); 
  }
}

/**
 * @description Create a new memory
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const createMemoController = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { result, success } = await createMemo(ownerId, req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while creating the memory",
      });
    }
    return res.status(201).json({
      result,
      success,
      msg: "Memories has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @createMemoController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Update a created memory details
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const updateMemoController = async (req, res) => {
  try {
    const postId = req.params["postId"];
    const ownerId = req.ownerId;
    const { result, success } = await updateMemo(postId, ownerId, req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while updating the memory",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Memory has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @updateMemoController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Delete a created memory details
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const deleteMemoController = async (req, res) => {
  try {
    const postId = req.params["postId"];
    const ownerId = req.ownerId;
    const { result, success } = await deleteMemo(postId, ownerId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while deleting the memory",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Memory has been deleted",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @extractor",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Post a comment for a specific memory
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const commentOnMemoController = async (req, res) => {
  try {
    const commentorId = req.ownerId;
    const { result, success } = await commentOnMemo(commentorId, req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while posting the comment",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Comment has been posted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @commentController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description React for a specific memory
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const heatOnMemoryController = async (req, res) => {
  try {
    const heaterId = req.ownerId;
    const { result, success } = await heatOnMemory(heaterId, req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong whilereacting the memory",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Reaction has been posted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @commentController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  getMemosController,
  getMemoByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
  commentOnMemoController,
  heatOnMemoryController,
  checkAndCreateHashtagsController
};
