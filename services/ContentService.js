const Memory = require("../models/Memory");
const Nomad = require("../models/Nomad");
const Tag = require("../models/Tag");
const Destination = require("../models/Destination");
const Trip = require("../models/Trip");

//#region Feed
const fetchFeed = async (userId) => {
  try {
    // Select intersts, tribe and geography details
    const nomad = await Nomad.findById(userId).select(
      "interests city country region tribe memories"
    );

    let memoryIdArray = [];

    // Get tribe memo ids
    const tribeMemories = await Nomad.find({
      _id: { $in: nomad.tribe },
    }).select("memories -_id");
    console.log("Tribe memos", tribeMemories);

    // Get geo city nomad memo ids
    const geoCityNomadMemoryIds = await Nomad.find({
      city: { $in: nomad.city },
    }).select("memories -_id");
    console.log("Geo city nomad memos", geoCityNomadMemoryIds);

    // Get geo country nomad memo ids
    const geoCountryNomadMemoryIds = await Nomad.find({
      country: { $in: nomad.country },
    }).select("memories -_id");
    console.log("Geo country nomad memos", geoCountryNomadMemoryIds);

    // Get interests nomad memo ids
    const interestsNomadMemoryIds = await Nomad.find({
      interests: { $in: nomad.interests },
    }).select("memories -_id");
    console.log("Interests nomad memos", interestsNomadMemoryIds);

    // Push all memory ids into single array
    tribeMemories.forEach((element) => memoryIdArray.push(...element.memories));
    geoCityNomadMemoryIds.forEach((element) =>
      memoryIdArray.push(...element.memories)
    );
    geoCountryNomadMemoryIds.forEach((element) =>
      memoryIdArray.push(...element.memories)
    );
    interestsNomadMemoryIds.forEach((element) =>
      memoryIdArray.push(...element.memories)
    );

    // Filter out own memories
    // memoryIdArray = memoryIdArray.filter(
    //   (element) => !nomad.memories.includes(element)
    // );

    // Cast memoryIdArray elemeents to string
    memoryIdArray = memoryIdArray.map((element) => element.toString());

    // Remove duplicates
    memoryIdArray = [...new Set(memoryIdArray)];

    const feedMemories = await Memory.find({ _id: { $in: memoryIdArray } })
      .populate({ path: "owner", select: "first_name last_name prof_img" })
      .populate({
        path: "comments.commentor",
        select: "first_name last_name prof_img",
      })
      .populate({ path: "heats", select: "first_name last_name prof_img" })
      .populate({ path: "destination" })
      .sort({ createdAt: -1, heats: -1 })
      .limit(100);

    return { result: feedMemories, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
//#endregion

//#region Memory
/**
 * @description Fetch memories by a specific user
 * @param {ObjectId} userId owner of the memories
 */
const getMemosByUser = (userId) => {
  return Memory.find({ owner: userId })
    .sort({ createdAt: -1, heats: -1 })
    .populate({ path: "owner", select: "first_name last_name prof_img" })
    .populate({
      path: "comments.commentor",
      select: "first_name last_name prof_img",
    })
    .populate({ path: "heats", select: "first_name last_name prof_img" })
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

    const saveMemoInNomad = await Nomad.findByIdAndUpdate(
      userId,
      { $push: { memories: result._id } },
      { new: true }
    );

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
//#endregion

//#region Trip

const createTrip = async (payload) => {
  const { userId, content, tripTitle, dayPlans, startDate, endDate } = payload;

  try {
    const tags = content !== "" ? await checkAndCreateHashtags(content) : [];

    const trip = new Trip({
      owner: userId,
      dayPlans,
      title: tripTitle,
      desc: content,
      start_date: startDate,
      end_date: endDate,
      tags,
    });

    const result = await trip.save();
    if (!result) return { result, success: false };

    const saveTripInNomad = await Nomad.findByIdAndUpdate(
      userId,
      { $push: { trips: result._id } },
      { new: true }
    );

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

// const getTripsbyId = async (userId) => {
//   try {
//     const result = await Trip.find({ owner: userId })
//       .sort({ startDate: -1 })
//       .populate({
//         path: "owner",
//         select: "first_name last_name prof_img",
//       });
//     if (!result) return { result, success: false };
//     return { result, success: true };
//   } catch (error) {
//     return { result: error.message, success: false };
//   }
// };

const getTripsByNomad = async (userId) => {
  try {
    console.log("inside trips");
    const result = await Trip.find({ owner: userId })
      .sort({ startDate: -1 })
      .populate({
        path: "owner",
        select: "first_name last_name prof_img",
      });
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

//#endregion
module.exports = {
  getMemosByUser,
  createMemo,
  updateMemo,
  deleteMemo,
  commentOnMemo,
  heatOnMemory,
  fetchFeed,
  checkAndCreateDestination,
  createTrip,
  getTripsByNomad,
};
