const { createTrip } = require("../services/ContentService");

const createTripController = async (req, res) => {
  try {
    const { result, success } = await createTrip(req.body);
    if (!success) {
      return res.status(422).json({
        result,
        success,
        msg: "Something went wrong while creating the trip",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Trip has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @createtripController",
      err: error,
      success: false,
    });
  }
};

// const getInterestsController = async (req, res) => {
//   try {
//     const interests = await getInterests();
//     return res
//       .status(200)
//       .json({ msg: "Got interests", success: true, result: interests });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ msg: "Couldn't fetch interests", result: error, success: false });
//   }
// };

module.exports = {
  createTripController,
};
