const Caravan = require("../models/Caravan");
const Blaze = require("../models/Blaze");

//#region CARAVAN METHODS

/**
 * @description Get a specific Caravan by its id
 * @param {ObjectId} caravanId
 */
const getCaravanById = (caravanId) => {
  console.log("inside get caravan by id");
  return Caravan.findById(caravanId)
    .populate({ path: "owner", select: "_id first_name last_name prof_img" })
    .populate({ path: "nomads", select: "_id first_name last_name prof_img" })
    .then((caravan) => ({ result: caravan, success: true }))
    .catch((err) => ({ result: err, success: false }));
};

/**
 * @description Get all Caravans which are owned by a user
 * @param {ObjectId} ownerId Caravan owner id
 */
const getCaravansByOwner = (ownerId) => {
  return Caravan.find({ owner: ownerId })
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
 * @param {ObjectId} ownerId Caravan creator's id
 * @param {Obejct} imageData req.file of multer object
 * @param {Object} payload HTTP request body
 */
const createCaravan = (ownerId, imageData, payload) => {
  const { caravanName, description, interests } = payload;
  const { path } = imageData;

  const caravan = new Caravan({
    owner: ownerId,
    caravan_name: caravanName,
    desc: description,
    interests: interests,
    display_img: path,
    nomads: ownerId,
  });

  const result = caravan
    .save()
    .then((result) => ({ result, success: true }))
    .catch((err) => ({ result: err, success: false }));

  return result;
};

/**
 * @description Connect a user to a caravan
 * @param {ObjectId} caravanId Caravan that is to be connected with
 * @param {ObjectId} userId User that is to be connected with
 */
const connectToCaravan = async (caravanId, userId) => {
  try {
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

    return updatedCaravan === null
      ? { result: null, success: false }
      : { result: updatedCaravan, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

// TODO: Leave a caravan

// TODO: Kick a Nomad from Caravan

/**
 * @description Update a Caravan
 * @param {ObjectId} caravanId Caravan that is to be updated
 * @param {ObjectId} ownerId Caravan owner id
 * @param {Object} payload HTTP request body
 */
const updateCaravan = (caravanId, ownerId, payload) => {
  const { caravanName, desc, interests } = payload;

  return Caravan.findOneAndUpdate(
    { _id: caravanId, owner: ownerId },
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

// TODO: Update caravan image feature

/**
 * @description Delete a Caravan
 * @param {ObjectId} caravanId Caravan that is to be deleted
 * @param {ObjectId} ownerId Caravan owner id
 */
const deleteCaravan = (caravanId, ownerId) => {
  return Caravan.findOneAndDelete({ _id: caravanId, owner: ownerId })
    .then((result) =>
      result === null ? { result, success: false } : { result, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};
//#endregion

//#region BLAZE METHODS

// TODO: Create new blaze
const createBlaze = async (ownerId, imageData, payload) => {
  const { path } = imageData;
  const { caravan, title, desc } = payload;

  // check if caravan is owned by the ownerId
  try {
    const caravanOwner = await Caravan.findOne({
      _id: caravan,
      owner: ownerId,
    });

    // if not return
    if (!caravanOwner) return { result: "Unauthorized Action", success: false };

    // if so create the new blaze
    const blaze = new Blaze({
      caravan,
      title,
      desc,
      image: path,
      participants: ownerId,
    });
    const result = blaze
      .save()
      .then((result) => ({ result, success: true }))
      .catch((err) => ({ result: err, success: false }));

    return result;
  } catch (error) {
    return { result: error, success: false };
  }
};

// TODO: Get blaze by date period
const getRecentBlazes = (balzeId) => {};

// TODO: Get blaze by id
const getBlazeById = (balzeId) => {};

// TODO: Get blazes by caravan
const getBlazesByCaravan = (caravanId) => {};

// TODO: Update a blaze
const updateBalze = (ownerId, blazeId, payload) => {};

// TODO: Mark as going to a blaze
const markAsGoingToBlaze = (userId, blazeId) => {};

// TODO: Delete a blaze
const deleteBlaze = (ownerId, blazeId) => {};

//#endregion

module.exports = {
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
