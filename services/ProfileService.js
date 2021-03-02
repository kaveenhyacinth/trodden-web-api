const Nomad = require("../models/Nomad");

/**
 * @description Find current user proffile by id
 * @param {String} userId Id of the profile owner
 */
const getProfilebyId = async (userId) => {
  try {
    const nomad = await Nomad.findById(userId);
    if (!nomad) {
      throw new Error("Couldn't find the user profile when fetching");
    }
    nomad.encry_password = undefined;
    nomad.salt = undefined;
    return { result: nomad, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Setup profile info after sign up
 * @param {Object} payload HTTP request body
 * @param {Object} imageData HTTP request file (contains image data by multer)
 */
const setupProfile = async (payload, imageData) => {
  const { userId, bio, occupation, contact, interests } = payload;
  const { filename } = imageData;

  try {
    const nomad = await Nomad.findByIdAndUpdate(
      userId,
      {
        $set: { prof_img: filename, prof_bio: bio, contact, occupation, role: 1 },
        $addToSet: { interests },
      },
      { new: true }
    );
    if (!nomad) {
      throw new Error("Couldn't find the user profile when updating");
    }
    return { result: nomad, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

module.exports = {
  getProfilebyId,
  setupProfile,
};
