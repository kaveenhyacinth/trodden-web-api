// const fs = require("fs");
const Memory = require("../models/Memory");
const Tag = require("../models/Tag");

/**
 * @description Get memories of the current user
 * @param {ObjectId} ownerId current signed user
 */
const getMemos = (ownerId) => {
  return Memory.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "first_name last_name" })
    .populate({ path: "comments.commentor", select: "first_name last_name" })
    .populate({ path: "heats", select: "first_name last_name" })
    .then((memos) => ({ result: memos, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Fetch memories by a specific user
 * @param {ObjectId} userId owner of the memories
 */
const getMemoByUser = (userId) => {
  return Memory.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "first_name last_name" })
    .populate({ path: "comments.commentor", select: "first_name last_name" })
    .populate({ path: "heats", select: "first_name last_name" })
    .then((memos) => ({ result: memos, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Check hashtags and create only if hashtags are unvailable
 * @param {String} content Content of the memory
 * @inner
 */
const checkAndCreateHashtags = (content) => {
  // extracts hashtags in the content
  const regexp = /(^|\s)#[a-zA-Z0-9][\w-]*\b/g;
  const result = content.match(regexp);

  if (!result) {
    return [];
  }

  /* Remove repeated tags using Set() | ref => https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/ */
  const trimmedTags = result.map((text) => text.toLowerCase().trim());
  const tags = [...new Set(trimmedTags)];

  // check their availability in the db
  tags.map((tagString) => {
    Tag.findOne({ tag_name: tagString }).then((res) => {
      if (res) return [];

      // store unavailable hashtags in the db
      const tag = new Tag({ tag_name: tagString });
      tag
        .save()
        .then(() => console.log("Tag has been saved to database"))
        .catch((err) => console.log("Error creating tag: " + err));
    });
  });

  return tags;
};

// FIXME: option to add multiple images
/**
 * @description Create a new post
 * @param {ObjectId} ownerId Cuttent user ID
 * @param {Object} payload request body
 */
const createMemo = (ownerId, payload, imageData) => {
  const { content, destination } = payload;
  const owner = ownerId;
  // const data = fs.readFileSync(imageData.path);
  // const contentType = imageData.mimetype;
  const { path } = imageData;

  // Check and create hashtags
  const tags = checkAndCreateHashtags(content);

  const memory = new Memory({
    owner,
    content,
    destination,
    tags,
    images: [path],
  });

  const result = memory
    .save()
    .then((result) => {
      return { result, success: true };
    })
    .catch((err) => ({ result: err, success: false }));

  return result;
};

/**
 * @description Update an existing post
 * @param {ObjectId} postId memory ID
 * @param {ObjectId} ownerId Cuttent user ID
 * @param {Object} payload request body
 */
const updateMemo = (postId, ownerId, payload) => {
  const { content, destination } = payload;

  // Check and create hashtags
  const tags = checkAndCreateHashtags(content);

  return Memory.findOneAndUpdate(
    { owner: ownerId, _id: postId },
    {
      $set: { content, destination, tags },
    },
    { new: true }
  )
    .then((memo) =>
      memo === null
        ? { result: memo, success: false }
        : { result: memo, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Delete a created prost by @param owneerId
 * @param {ObjectId} postId memory id
 * @param {ObjectId} ownerId The owner of the memory (signed-in user)
 */
const deleteMemo = (postId, ownerId) => {
  return Memory.findOneAndDelete({ _id: postId, owner: ownerId })
    .then((result) =>
      result === null ? { result, success: false } : { result, success: true }
    )
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
  // checkAndCreateHashtags,
};
