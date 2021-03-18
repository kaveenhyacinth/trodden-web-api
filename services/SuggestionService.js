const Interest = require("../models/Interest");
const Caravan = require("../models/Caravan");
const Nomad = require("../models/Nomad");
const Bond = require("../models/BondRequest");

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

const suggestNomdsByInterests = async (userId) => {
  try {
    // Get nomad interests
    const nomad = await Nomad.findById(userId);
    // Find suggestions according to nomad interests
    const rawNomadSuggestions = await Nomad.find({
      interests: { $in: nomad.interests },
    }).select("first_name last_name prof_img");
    // Remove the self record
    let nomadSuggestions = rawNomadSuggestions.filter(
      (nomad) => nomad._id != userId
    );

    if (nomadSuggestions === [])
      return { result: nomadSuggestions, success: true };

    // // Remove if already bonded
    // if (nomad.tribe) {
    //   nomadSuggestions = nomadSuggestions.filter(
    //     (item) => !nomad.tribe.includes(item._id)
    //   );
    // }

    // if (nomadSuggestions === [])
    //   return { result: nomadSuggestions, success: true };

    // check if active bond reqs
    const activeBonds = await Bond.find({ requestee: nomad._id });
    // Filter if active bond reqs
    if (activeBonds) {
      // filter active bond owner ids
      const activeBondOwners = [];
      activeBonds.forEach((element) => {
        activeBondOwners.push(element.owner);
      });
      // remove active bonds
      nomadSuggestions = nomadSuggestions.filter(
        (item) => activeBondOwners.indexOf(item._id) === -1
      );
    }
    return { result: nomadSuggestions, success: true };
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
  return Interest.find({})
    .select("id title image")
    .then((interests) => interests)
    .catch((err) => err);
};

module.exports = {
  suggestCaravansByInterests,
  suggestNomdsByInterests,
  createInterest,
  getInterests,
};
