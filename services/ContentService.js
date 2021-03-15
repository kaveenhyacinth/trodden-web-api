// const fs = require("fs");
const Memory = require("../models/Memory");
const Tag = require("../models/Tag");
const Destination = require("../models/Destination");

/**
 * @description Fetch memories by a specific user
 * @param {ObjectId} userId owner of the memories
 */
const getMemosByUser = (userId) => {
  return Memory.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "first_name last_name" })
    .populate({ path: "comments.commentor", select: "first_name last_name" })
    .populate({ path: "heats", select: "first_name last_name" })
    .populate({ path: "destination" })
    .then((memos) => ({ result: memos, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Check hashtags and create only if hashtags are unvailable
 * @param {String} content Content of the memory
 * @inner
 * @returns Tags
 */
const checkAndCreateHashtags = async (content) => {
  // extracts hashtags in the content
  const regexp = /(^|\s)#[a-zA-Z0-9][\w-]*\b/g;
  const result = content.match(regexp);

  if (!result) return [];

  /* Remove repeated tags using Set() | ref => https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/ */
  const trimmedTags = result.map((text) => text.toLowerCase().trim());
  const tags = [...new Set(trimmedTags)];

  try {
    // check their availability in the db
    tags.map(async (tagString) => {
      const result = await Tag.findOne({ tag_name: tagString });
      if (result) return [];

      // store unavailable hashtags in the db
      const tag = new Tag({ tag_name: tagString });
      const newResult = await tag.save();
      if (!newResult) throw new Error("Error creating tag");
    });

    return tags;
  } catch (error) {
    throw error;
  }
};

/**
 * Check for destination and create one only if unavailable
 * @param {Object} destination
 * @inner
 * @returns destination id
 */
const checkAndCreateDestination = async (destination) => {
  try {
    const result = await Destination.findOne({ des_ref: destination.id });
    // Return if destination available
    if (result) return result._id;

    // Store if destination unavailable
    const newDestination = new Destination({
      des_name: destination.name,
      des_ref: destination.id,
      des_type: destination.types,
    });

    const newResult = await newDestination.save();
    if (!newResult) throw new Error("Error while creating destination");

    return newResult._id;
  } catch (error) {
    throw error;
  }
};

// FIXME: option to add multiple images
/**
 * @description Create a new post
 * @param {Object} payload Http request body
 * @param {Object} imageData Multer's req.fiile object
 */
const createMemo = async (payload) => {
  const { userId, content, media, destination } = payload;

  try {
    const tags = content !== "" ? await checkAndCreateHashtags(content) : [];

    const des = destination.id
      ? await checkAndCreateDestination(destination)
      : null;

    console.log("Try media:", media);

    const memory = new Memory({
      owner: userId,
      content,
      destination: des,
      tags,
      media,
    });

    console.log("Memory Body to save:", memory);

    const result = await memory.save();
    console.log("Result:", result);
    if (!result) return { result, success: false };

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Update an existing post
 * @param {Object} payload request body
 */
const updateMemo = (payload) => {
  const { userId, postId, content, destination } = payload;

  // Check and create hashtags
  try {
    const tags = checkAndCreateHashtags(content);

    return Memory.findOneAndUpdate(
      { owner: userId, _id: postId },
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
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Delete a created prost by @param owneerId
 * @param {ObjectId} postId memory id
 * @param {ObjectId} userId The owner of the memory (signed-in user)
 */
const deleteMemo = (postId, userId) => {
  return Memory.findOneAndDelete({ _id: postId, owner: userId })
    .then((result) =>
      result === null ? { result, success: false } : { result, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Post a new comment on a memorry
 * @param {Object} payload request body
 */
const commentOnMemo = (payload) => {
  const { userId, postId, content } = payload;
  const comments = { commentor: userId, content };

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
 * @param {Object} payload request body
 * @async
 */
const heatOnMemory = async (payload) => {
  try {
    const { userId, postId } = payload;
    // check if user reacted before
    const memory = await Memory.findOne({ _id: postId, heats: userId });
    if (memory) {
      // if reacted pull user
      return Memory.findByIdAndUpdate(
        postId,
        { $pull: { heats: userId } },
        { new: true }
      )
        .then((memo) => ({ result: memo, success: true }))
        .catch((err) => ({ result: err, success: false }));
    } else {
      // if not reacted push user
      return Memory.findByIdAndUpdate(
        postId,
        { $push: { heats: userId } },
        { new: true }
      )
        .then((memo) => ({ result: memo, success: true }))
        .catch((err) => ({ result: err, success: false }));
    }
  } catch (error) {
    return { result: error, success: false };
  }
};

module.exports = {
  getMemosByUser,
  createMemo,
  updateMemo,
  deleteMemo,
  commentOnMemo,
  heatOnMemory,
};
