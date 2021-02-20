const Caravan = require("../models/Caravan");

/**
 * @description Get a specific Caravan by its id
 * @param {ObjectId} caravanId
 */
const getCaravanById = (caravanId) => {
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

// TODO: get caravans by interests and tags

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
    interests,
    display_img: path,
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
  const isOwner = await Caravan.findById(caravanId)
    .then((caravan) => {
      if (caravan.owner != userId) return false;
      return true;
    })
    .catch((err) => false);

  if (isOwner) return { result: "Self connect is not allowed", success: false };

  return Caravan.findByIdAndUpdate(
    caravanId,
    {
      $addToSet: { nomads: userId },
    },
    { new: true }
  )
    .then((result) =>
      result === null ? { result, success: false } : { result, success: true }
    )
    .catch((err) => ({ result: err, success: false }));
};

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

module.exports = {
  createCaravan,
  getCaravanById,
  getCaravansByOwner,
  getCaravansByUser,
  connectToCaravan,
  updateCaravan,
  deleteCaravan,
};
