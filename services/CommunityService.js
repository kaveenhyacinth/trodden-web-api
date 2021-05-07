const Bond = require("../models/BondRequest");
const Caravan = require("../models/Caravan");
const Blaze = require("../models/Blaze");
const Nomad = require("../models/Nomad");

const { checkAndCreateDestination } = require("./ContentService");

//#region BOND
const getIncomingBondRequests = async (userId) => {
  try {
    const result = await Bond.find({ requestee: userId }).populate({
      path: "owner",
      select: "first_name last_name prof_img",
    });
    return { result, success: true };
  } catch (error) {
    console.log("fatel errror", error);
    return { result: error, success: false };
  }
};

const getOutgoingBondRequests = async (userId) => {
  try {
    const result = Bond.find({ owner: userId }).populate({
      path: "requestee",
      select: "first_name last_name prof_img",
    });
    return { result, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

const placeBondRequest = async (payload) => {
  try {
    const { userId, requestee } = payload;
    const isExisting = await Bond.findOne({ owner: userId, requestee });
    if (
      isExisting &&
      isExisting.owner == userId &&
      isExisting.requestee == requestee
    ) {
      return { result: isExisting, success: true };
    }
    const newBondrequest = new Bond({
      owner: userId,
      requestee,
    });
    const result = await newBondrequest.save();
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

const confirmBondRequest = async (payload) => {
  try {
    const { userId, requestId, requestorId } = payload;
    // save requestee in tribe
    const requesteeResult = await Nomad.findByIdAndUpdate(
      userId,
      { $addToSet: { tribe: requestorId } },
      { new: true }
    );
    const requestorResult = await Nomad.findByIdAndUpdate(
      requestorId,
      { $addToSet: { tribe: userId } },
      { new: true }
    );
    // delete request from bondRequest
    const deleteBond = await removeBondRequest(requestId);
    if (!deleteBond) throw new Error("Couldn't confirm request!");
    return { result: { requesteeResult, requestorResult }, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

const removeBondRequest = (requestId) => {
  return Bond.findByIdAndDelete(requestId)
    .then(() => ({ result: null, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

const rejectBondRequest = () => {};
//#endregion

//#region CARAVAN

/**
 * @description Get a specific Caravan by its id
 * @param {ObjectId} caravanId
 */
const getCaravanById = (caravanId) => {
  console.log("inside get caravan by id");
  return Caravan.findById(caravanId)
    .populate({ path: "owner", select: "_id first_name last_name prof_img" })
    .populate({ path: "nomads", select: "_id first_name last_name prof_img" })
    .populate("blazes")
    .populate("blazes.location")
    .then((caravan) => ({ result: caravan, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Get all Caravans which are owned by a user
 * @param {ObjectId} userId Caravan owner id
 */
const getCaravansByOwner = (userId) => {
  return Caravan.find({ owner: userId })
    .populate({ path: "owner", select: "_id first_name last_name prof_img" })
    .populate({ path: "nomads", select: "_id first_name last_name prof_img" })
    .then((caravan) => ({ result: caravan, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Get all Caravans where a specific user is in
 * @param {ObjectId} userId Caravan participant id
 */
const getCaravansByUser = (userId) => {
  return Caravan.find({ nomads: userId })
    .populate({ path: "owner", select: "_id first_name last_name prof_img" })
    .populate({ path: "nomads", select: "_id first_name last_name prof_img" })
    .then((caravan) => ({ result: caravan, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Create a new Caravan
 * @param {Object} payload HTTP request body
 * @param {Obejct} imageData req.file of multer object
 */
const createCaravan = (payload) => {
  const {
    userId,
    caravanName,
    caravanDescription,
    interests,
    filename,
  } = payload;

  const caravan = new Caravan({
    owner: userId,
    caravan_name: caravanName,
    desc: caravanDescription,
    interests,
    display_img: filename,
    nomads: userId,
  });

  const result = caravan
    .save()
    .then((result) => ({ result, success: true }))
    .catch((err) => ({ result: err, success: false }));

  return result;
};

/**
 * @description Connect a user to a caravan
 * @param {Object} payload HTTP request body
 */
const connectToCaravan = async (payload) => {
  console.log("Inside Connect to caravan");
  try {
    const { userId, caravanId } = payload;
    const caravan = await Caravan.findById(caravanId);
    const isOwner = caravan.owner == userId ? true : false;
    if (isOwner)
      return { result: "Self connect is not allowed", success: false };
    const updatedCaravan = await Caravan.findByIdAndUpdate(
      caravanId,
      {
        $addToSet: { nomads: userId },
      },
      { new: true }
    );

    console.log("result at connect to caravan", updatedCaravan);

    return updatedCaravan === null
      ? { result: null, success: false }
      : { result: updatedCaravan, success: true };
  } catch (error) {
    console.log("error at connect to caravan", error);
    return { result: error, success: false };
  }
};

// TODO: Leave a caravan

// TODO: Kick a Nomad from Caravan

/**
 * @description Update a Caravan
 * @param {Object} payload HTTP request body
 */
const updateCaravan = (payload) => {
  const { userId, caravanId, caravanName, desc, interests } = payload;

  return Caravan.findOneAndUpdate(
    { _id: caravanId, owner: userId },
    {
      $set: { caravan_name: caravanName, desc, interests },
    },
    { new: true }
  )
    .then((caravan) =>
      caravan === null
        ? { result: caravan, success: false }
        : { result: caravan, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Delete a Caravan
 * @param {ObjectId} userId Caravan owner id
 * @param {ObjectId} caravanId Caravan that is to be deleted
 */
const deleteCaravan = (userId, caravanId) => {
  return Caravan.findOneAndDelete({ _id: caravanId, owner: userId })
    .then((result) =>
      result === null ? { result, success: false } : { result, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};
//#endregion

//#region BLAZE

/**
 * @description Create new blaze
 * @param {Object} payload Http request body
 * @param {Object} imageData Http request file by multer
 * @async
 */
const createBlaze = async (payload) => {
  const { userId, caravanId, title, desc, date, location, filename } = payload;

  console.log("Payload at blaze creation", payload);

  // check if caravan is owned by the ownerId
  try {
    const caravanOwner = await Caravan.findOne({
      _id: caravanId,
      owner: userId,
    });

    console.log("Caravan owner at blaze create", caravanOwner);

    // if not return
    if (!caravanOwner) throw new Error("Unauthorized Action");

    const des = location.id ? await checkAndCreateDestination(location) : null;

    console.log("Destination id at blaze creation", des);

    // if so create the new blaze
    const blaze = new Blaze({
      caravan: caravanId,
      title,
      desc,
      image: filename,
      participants: userId,
      date,
      location: des,
    });

    console.log("Blaze to save", blaze);

    const newBlaze = await blaze.save();
    if (!newBlaze)
      throw new Error("Something went wrong while saving blaze @service");

    console.log("Blaze saves");

    const saveBlazeInCaravan = await Caravan.findByIdAndUpdate(
      caravanId,
      { $push: { blazes: newBlaze._id } },
      { new: true }
    );

    console.log("Blaze saved in caravan");

    return { result: newBlaze, success: true };
  } catch (error) {
    console.log("Error at blaze creation", error);
    return { result: error.message, success: false };
  }
};

// TODO: Get blaze by date period
const getRecentBlazes = (balzeId) => {};

const getBlazeById = async (balzeId) => {
  try {
    const result = await Blaze.findById(balzeId)
      .sort({ date: 1 })
      .populate({
        path: "participants",
        select: "first_name last_name prof_img",
      })
      .populate({
        path: "caravan",
        select: "caravan_name",
      })
      .populate("location");

    if (!result)
      throw new Error("Something went wrong while fetching blazes @service");

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

const getBlazesByCaravan = async (caravanId) => {
  try {
    const result = await Blaze.find({
      caravan: caravanId,
      date: { $gte: Date.now() },
    })
      .sort({ date: 1 })
      .populate({
        path: "participants",
        select: "first_name last_name prof_img",
      })
      .populate("location");

    if (!result)
      throw new Error("Something went wrong while fetching blazes @service");

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

// TODO: Update a blaze
const updateBalze = (ownerId, blazeId, payload) => {};

// TODO: Mark as going to a blaze
const markAsGoingToBlaze = (userId, blazeId) => {};

// TODO: Delete a blaze
const deleteBlaze = (ownerId, blazeId) => {};

//#endregion

module.exports = {
  getIncomingBondRequests,
  getOutgoingBondRequests,
  placeBondRequest,
  removeBondRequest,
  confirmBondRequest,
  rejectBondRequest,
  createCaravan,
  getCaravanById,
  getCaravansByOwner,
  getCaravansByUser,
  connectToCaravan,
  updateCaravan,
  deleteCaravan,
  createBlaze,
  getRecentBlazes,
  getBlazesByCaravan,
  getBlazeById,
  markAsGoingToBlaze,
  updateBalze,
  deleteBlaze,
};
