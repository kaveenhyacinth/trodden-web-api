const Nomad = require("../models/Nomad");

// find current user proffile by id
const getProfilebyId = (id) => {
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
const setupProfile = (id, payload, imageData) => {
  const { bio, occupation, contact, interests } = payload;
  const {path} = imageData;

  return Nomad.findByIdAndUpdate(
    id,
    {
      $set: { prof_img: path, prof_bio: bio, contact, occupation, role: 1 },
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
