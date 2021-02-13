const Nomad = require("../models/Nomad");

const tokenDecoder = require("../middlewares/tokenDecoder");

// find current user proffile by id
const getProfilebyId = (bearerToken) => {
  const id = tokenDecoder(bearerToken);
  console.log("Id @ProfileService @getProfilebyId : " + id);

  return Nomad.findById(id)
    .then((nomad) => ({
      nomad,
      success: true,
    }))
    .catch((err) => ({
      nomad: null,
      success: false,
      err,
    }));
};

// Setup profile info after sign up
const setupProfile = (id, payload) => {
  const { bio, occupation, contact, interests } = payload;

  return Nomad.findByIdAndUpdate(
    id,
    {
      $set: { prof_bio: bio, contact, occupation, role: 1 },
      $addToSet: { interests },
    },
    { new: true }
  )
    .then((result) => result)
    .catch((err) => err);
};

module.exports = {
  getProfilebyId,
  setupProfile,
};
