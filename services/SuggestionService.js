const Interest = require("../models/Interest");
const Caravan = require("../models/Caravan");
const Nomad = require("../models/Nomad");
const Bond = require("../models/BondRequest");

const suggestCaravansByInterests = async (userId) => {
  try {
    // Extract user
    const nomad = await Nomad.findById(userId);

    // Fetch caravans in user interests
    const rawCaravanSuggestions = await Caravan.find({
      interests: { $in: nomad.interests },
    });

    // Remove own caravans
    let caravanSuggestions = rawCaravanSuggestions.filter(
      (caravan) => caravan.owner != userId
    );
    return { result: caravanSuggestions, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

/**
 * Get nomad suggestions for a given user
 * @param {ObjectId} userId
 * @returns Object
 */
const suggestNomdsByInterests = async (userId) => {
  try {
    // Get nomad interests
    const nomad = await Nomad.findById(userId);

    // Find suggestions by nomad interests
    const rawNomadSuggestions = await Nomad.find({
      interests: { $in: nomad.interests },
    }).select("first_name last_name prof_img");

    // Remove the self record suggestion
    let nomadSuggestions = rawNomadSuggestions.filter(
      (nomad) => nomad._id != userId
    );

    // Return if no non-self suggestions
    if (nomadSuggestions === [])
      return { result: nomadSuggestions, success: true };

    // Create suggestions array
    const suggestionsArray = [];
    nomadSuggestions.forEach((element) =>
      suggestionsArray.push(element._id.toString())
    );

    // Create omition ids array
    const omitionIds = [];

    // Push existing nomads to omition
    if (nomad.tribe)
      nomad.tribe.forEach((element) => omitionIds.push(element.toString()));

    // Get active incomming bond requestors
    const incomingBondReqs = await Bond.find({ requestee: nomad._id }).select(
      "owner"
    );
    if (incomingBondReqs)
      // Push active incoming bond requestors to omition
      incomingBondReqs.forEach((element) => {
        omitionIds.push(element.owner.toString());
      });

    // Get active outgoing bond requestees
    const outgoingBondReqs = await Bond.find({ owner: nomad._id }).select(
      "requestee"
    );
    if (outgoingBondReqs) {
      // Push active outgoing bond requestees to omition
      outgoingBondReqs.forEach((element) => {
        omitionIds.push(element.requestee.toString());
      });
    }

    // Remove duplications in omition using Set()
    const omition = [...new Set(omitionIds)];

    // Filter nomad suggestions using omition
    nomadSuggestions = nomadSuggestions.filter(
      (item) => !omition.includes(item._id.toString())
    );

    console.log("Final suggestion", nomadSuggestions); // <-clg

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
