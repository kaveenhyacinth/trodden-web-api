const {
  getMemosByUser,
  createMemo,
  updateMemo,
  deleteMemo,
  commentOnMemo,
  heatOnMemory,
} = require("../services/ContentService");

/**
 * @description Get all the memories which belong to a specific user
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const getMemosByUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { result, success } = await getMemosByUser(userId);
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
      msg: "Memories have been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getMemosByUserController",
      err: error,
      success: false,
    });
  }
};

/**
 * @description Create a new memory
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const createMemoController = async (req, res) => {
  try {
    console.log("Image: " + req.file);
    const { result, success } = await createMemo(req.body, req.file);
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
      msg: "Memory has been created successfully",
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
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const updateMemoController = async (req, res) => {
  try {
    const { result, success } = await updateMemo(req.body);
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
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const deleteMemoController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const ownerId = req.params.userId;
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
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const commentOnMemoController = async (req, res) => {
  try {
    const { result, success } = await commentOnMemo(req.body);
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
 * @param {HTTP} req HTTP request
 * @param {HTTP} res HTTP response
 * @async
 */
const heatOnMemoryController = async (req, res) => {
  try {
    const { result, success } = await heatOnMemory(req.body);
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
  getMemosByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
  commentOnMemoController,
  heatOnMemoryController,
};
