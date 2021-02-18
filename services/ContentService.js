const Memory = require("../models/Memory");
const Tag = require("../models/Tag");

// TODO: populate Nomads in heats
/**
 * @description Get memories of the current user
 * @param {ObjectId} ownerId current signed user
 */
const getMemos = (ownerId) => {
  return Memory.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "first_name last_name" })
    .populate({ path: "comments.commentor", select: "first_name last_name" })
    .then((memos) => ({ result: memos, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

// TODO: populate Nomads in heats
/**
 * @description Fetch memories by a specific user
 * @param {ObjectId} userId owner of the memories
 */
const getMemoByUser = (userId) => {
  return Memory.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "first_name last_name" })
    .populate({ path: "comments.commentor", select: "first_name last_name" })
    .then((memos) => ({ result: memos, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

const checkAndCreateHashtags = (content) => {
  // extracts hashtags in the content
  const regexp = /(^|\s)#[a-zA-Z0-9][\w-]*\b/g;
  const result = content.match(regexp);

  if (!result) {
    console.log("No hashtags found in @checkAndCreateHashtags"); // <- clg
    // return ["-1"];
  }

  // TODO: Remove repeated tags
  const tags = result.map((text) => text.trim());
  // console.log("Extracted Hashtag @checkAndCreateHashtags" + tags); // <- clg
  // return tags;

  // check their availability in the db
  tags.map((tagString) => {
    Tag.findOne({ tag_name: tagString }).then((res) => {
      if (res) return [];

      const tag = new Tag({ tag_name: tagString });
      tag
        .save()
        .then(() => console.log("Tag has been saved to database"))
        .catch((err) => console.log("Error creating tag: " + err));
    });
  });

  return tags;

  // store unavailable hashtags in the db
};

// TODO: option to add tags
// TODO: option to ad images
/**
 * @description Create a new post
 * @param {ObjectId} ownerId Cuttent user ID
 * @param {Object} payload request body
 */
const createMemo = (ownerId, payload) => {
  const { content, tags, destination, images } = payload;
  const owner = ownerId;

  const memory = new Memory({
    owner,
    content,
    destination,
    tags,
    images,
  });

  return memory
    .save()
    .then((result) => ({ result, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

// TODO: option to update tags
/**
 * @description Update an existing post
 * @param {ObjectId} postId memory ID
 * @param {ObjectId} ownerId Cuttent user ID
 * @param {Object} payload request body
 */
const updateMemo = (postId, ownerId, payload) => {
  const { content, tags, destination } = payload;

  return Memory.findOneAndUpdate(
    { _id: postId, owner: ownerId },
    {
      $set: { content, destination },
      $addToSet: { tags },
    },
    { new: true }
  )
    .then((memo) => ({ result: memo, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Delete a created prost by @param owneerId
 * @param {ObjectId} postId memory id
 * @param {ObjectId} ownerId The owner of the memory (signed-in user)
 */
const deleteMemo = (postId, ownerId) => {
  return Memory.findOneAndDelete({ _id: postId, owner: ownerId })
    .then((result) => ({ result, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Post a new comment on a memorry
 * @param {ObjectId} commentorId commentor id (current user)
 * @param {Object} payload request body
 */
const commentOnMemo = (commentorId, payload) => {
  const { postId, content } = payload;
  const commentor = commentorId;
  const comments = { commentor, content };

  return Memory.findByIdAndUpdate(
    postId,
    { $push: { comments } },
    { new: true }
  )
    .then((memo) => ({ result: memo, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description React on a specific memory
 * @param {ObjectId} heaterId Reactor id (current user)
 * @param {*} payload Request body
 */
const heatOnMemory = (heaterId, payload) => {
  const { postId, reacted } = payload;

  if (reacted) {
    return Memory.findByIdAndUpdate(
      postId,
      { $pull: { heats: heaterId } },
      { new: true }
    )
      .then((memo) => ({ result: memo, success: true }))
      .catch((err) => ({ result: err, success: false }));
  }

  return Memory.findByIdAndUpdate(
    postId,
    { $push: { heats: heaterId } },
    { new: true }
  )
    .then((memo) => ({ result: memo, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

module.exports = {
  getMemos,
  getMemoByUser,
  createMemo,
  updateMemo,
  deleteMemo,
  commentOnMemo,
  heatOnMemory,
  checkAndCreateHashtags,
};
