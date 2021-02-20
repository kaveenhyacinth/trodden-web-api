const Interest = require("../models/Interest");
const Caravan = require("../models/Caravan");
const Nomad = require("../models/Nomad");

// TODO: get caravans by interests
const suggestCaravansByInterests = async (userId) => {
  try {
    const nomad = await Nomad.findById(userId);
    const caravans = await Caravan.find({
      interests: { $in: nomad.interests },
    });
    return { result: caravans, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

const createInterest = (payload) => {
  const { title, desc } = payload;

  const interest = new Interest({
    title,
    desc,
  });

  return interest
    .save()
    .then(() => ({ msg: "Interest Saved", success: true }))
    .catch((err) => ({
      err,
      msg: "Interest aborted",
      success: false,
    }));
};

const getInterests = () => {
  return Interest.find({})
    .then((interests) => interests)
    .catch((err) => err);
};

module.exports = {
  suggestCaravansByInterests,
  createInterest,
  getInterests,
};
