const Interest = require("../models/Interest");

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
  createInterest,
  getInterests
};
