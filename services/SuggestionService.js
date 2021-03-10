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
    return { result: error, success: false };
  }
};

const createInterest = async (payload, imageData) => {
  const { title, desc } = payload;
  const { filename } = imageData;

  const interest = new Interest({
    title,
    desc,
    image: filename,
  });

  try {
    await interest.save();
    return { msg: "Interest Saved", success: true };
  } catch (err) {
    return {
      err,
      msg: "Interest aborted",
      success: false,
    };
  }
};

const getInterests = () => {
  return Interest.find({}).select("id title image")
    .then((interests) => interests)
    .catch((err) => err);
};

module.exports = {
  suggestCaravansByInterests,
  createInterest,
  getInterests,
};
