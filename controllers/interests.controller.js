const {
  createInterest,
  getInterests,
} = require("../services/SuggestionService");

const createInterestController = async (req, res) => {
  try {
    const result = await createInterest(req.body, req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Couldn't save interest", err: error, success: false });
  }
};

const getInterestsController = async (req, res) => {
  try {
    const interests = await getInterests();
    return res
      .status(200)
      .json({ msg: "Got interests", success: true, result: interests });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Couldn't fetch interests", result: error, success: false });
  }
};

module.exports = {
  createInterestController,
  getInterestsController,
};
