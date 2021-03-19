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

    // set suggestions array
    const suggestionsArray = [];
    nomadSuggestions.forEach((element) =>
      suggestionsArray.push(element._id.toString())
    );

    console.log("Suggestion Array", suggestionsArray);

    const activeBondsReqs = [];

    // check with tribe
    nomad.tribe.forEach((element) => activeBondsReqs.push(element.toString()));

    // check if incoming bond reqs
    const incomingBondReqs = await Bond.find({ requestee: nomad._id }).select(
      "owner"
    );

    console.log("incoming", incomingBondReqs);
    // Filter if incoming bond reqs
    if (incomingBondReqs) {
      // filter incoming bond owner ids
      incomingBondReqs.forEach((element) => {
        activeBondsReqs.push(element.owner.toString());
      });
      // remove active bonds
      // nomadSuggestions = nomadSuggestions.filter(
      //   (item) => activeBondsReqs.indexOf(item._id) === -1
      // );
    }

    // Check if outgoing bond reqs
    const outgoingBondReqs = await Bond.find({ owner: nomad._id }).select(
      "requestee"
    );
    console.log("outgoing", outgoingBondReqs);
    // Filter if outgoing bond reqs
    if (outgoingBondReqs) {
      // filter outgoing bond requestee ids
      outgoingBondReqs.forEach((element) => {
        activeBondsReqs.push(element.requestee.toString());
      });
    }

    console.log("active bonds", activeBondsReqs);

    // concat active bond reqs with active bonds
    // const unformattedOmition = [
    //   ...(nomad.tribe ?? []),
    //   ...(activeBondsReqs ?? []),
    // ];

    // console.log("unformattedOmition", unformattedOmition);

    // Remove duplication and format omition
    const omition = [...new Set(activeBondsReqs)];

    console.log("Omition", omition);

    // Omit and format suggestions
    nomadSuggestions = nomadSuggestions.filter(
      (item) => !omition.includes(item._id.toString())
    );

    console.log("Final suggestion", nomadSuggestions);

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
