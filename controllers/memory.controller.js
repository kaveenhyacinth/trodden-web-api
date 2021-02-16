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
 * @description User can create a memory to share a travel experience
 * @param {*} req HTTP request 
 * @param {*} res HTTP response
 */
const createMemoController = (req, res) => {

};

const updateMemoController = (req, res) => {};
const deleteMemoController = (req, res) => {};

module.exports = {
  getMemosController,
  getMemoByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
};
