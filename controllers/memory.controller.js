const tokenDecoder = require("../middlewares/tokenDecoder");
const {
  getMemos,
  getMemoByUser,
  createMemo,
  updateMemo,
  deleteMemo,
} = require("../services/ContentService");

const getMemosController = (req, res) => {};
const getMemoByUserController = (req, res) => {};

/**
 * @description Create a new memory
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const createMemoController = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(400).json({
        msg: "Your token has expired or invalid",
        success: false,
      });
    const id = tokenDecoder(token);
    const result = await createMemo(id, req.body);
    return res.status(200).json({
      err: result.err,
      msg: result.msg,
      success: result.success,
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
 * @description Update a created memory details
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 */
const updateMemoController = async (req, res) => {
  try {
    const postId = req.params["postId"];
    const { result, success } = await updateMemo(postId, req.body);
    if (!success) {
      return res.status(400).json({
        result,
        msg: "Something went wrong while updating the memory",
      });
    }
    return res.status(200).json({
      result,
      msg: "Memory has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @extractor",
      err: error,
      success: false,
    });
  }
};

const deleteMemoController = (req, res) => {};

module.exports = {
  getMemosController,
  getMemoByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
};
