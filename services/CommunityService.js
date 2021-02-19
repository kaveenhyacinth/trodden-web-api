const Caravan = require("../models/Caravan");
const Nomad = require("../models/Nomad");
const Tag = require("../models/Tag");
const Blaze = require("../models/Blaze");

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
const getCaravansByowner = (ownerId) => {
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
 *
 * @param {ObjectId} caravanId Caravan that is to be connect with
 * @param {ObjectId} userId
 */
const connectToCaravan = (caravanId, userId) => {
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

// TODO: update caravan

// TODO: delete caravan

module.exports = {
  createCaravan,
  getCaravanById,
  getCaravansByowner,
  getCaravansByUser,
};
