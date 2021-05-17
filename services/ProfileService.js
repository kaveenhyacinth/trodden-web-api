const Nomad = require("../models/Nomad");

/**
 * @description Find current user proffile by id
 * @param {String} userId Id of the profile owner
 */
const getProfilebyId = async (userId) => {
  try {
    const nomad = await Nomad.findById(userId)
      .populate("memories")
      .populate({
        path: "memories.owner",
        select: "first_name last_name prof_img",
      })
      .populate("interests")
      .populate("tribe");
    if (!nomad) {
      throw new Error("Couldn't find the user profile when fetching");
    }
    nomad.encry_password = undefined;
    nomad.salt = undefined;

    console.log(nomad);
    return { result: nomad, success: true };
  } catch (error) {
    console.error("Error", error);
    return { result: error.message, success: false };
  }
};

/**
 * @description Fetch Tribe List
 * @param {String} userId Id of the profile owner
 */
const getTribeList = async (userId) => {
  try {
    const result = await Nomad.findById(userId).select("tribe").populate({
      path: "tribe",
      select: "first_name last_name prof_img",
    });
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Setup profile info after sign up
 * @param {Object} payload HTTP request body
 */
const setupProfile = async (payload) => {
  const {
    userId,
    bio,
    occupation,
    contact,
    city,
    country,
    birthdate,
    gender,
    region,
    interests,
    filename,
  } = payload;

  try {
    const nomad = await Nomad.findByIdAndUpdate(
      userId,
      {
        $set: {
          prof_img: filename,
          prof_bio: bio,
          contact,
          occupation,
          city,
          country,
          region,
          birthdate,
          gender,
          role: 1,
        },
        $addToSet: { interests },
      },
      { new: true }
    );
    if (!nomad) {
      throw new Error("Couldn't find the user profile when updating");
    }

    // Undefine sensetive data
    nomad.encry_password = undefined;
    nomad.salt = undefined;
    nomad.__v = undefined;

    return { result: nomad, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

const updateUserIntersts = async (userId, interests) => {
  try {
    const result = await Nomad.findByIdAndUpdate(
      userId,
      { interests },
      { new: true }
    );
    if (!result) return { result: "Couldn't update Interests", success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

module.exports = {
  getProfilebyId,
  getTribeList,
  setupProfile,
  updateUserIntersts,
};
