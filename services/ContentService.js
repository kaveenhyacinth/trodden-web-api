const Memory = require("../models/Memory");
// const Tag = require("../models/Tag");

const getMemos = () => {};
const getMemoByUser = () => {};

/**
 * @description Create a new post
 * @param {String} id Cuttent user ID
 * @param {Object} payload request body
 */
const createMemo = (id, payload) => {
  const { content, tags, destination, images } = payload;
  const owner = id;

  const memory = new Memory({
    owner,
    content,
    destination,
    tags,
    images,
  });

  return memory
    .save()
    .then(() => ({ msg: "Memory has posted", success: true, err: undefined }))
    .catch((err) => ({
      err,
      msg: "Error occured while posting the memory",
      success: false,
    }));
};

/**
 * @description Update an existing post
 * @param {String} id Cuttent user ID
 * @param {Object} payload request body
 */
const updateMemo = (id, payload) => {
  const { content, tags, destination } = payload;

  return Memory.findByIdAndUpdate(
    id,
    {
      $set: { content, destination },
      $addToSet: { tags },
    },
    { new: true }
  )
    .then((memo) => ({ result: memo, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

const deleteMemo = () => {};

module.exports = {
  getMemos,
  getMemoByUser,
  createMemo,
  updateMemo,
  deleteMemo,
};
