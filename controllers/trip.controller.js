const { createTrip, getTripsByNomad } = require("../services/ContentService");

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

const getTripByNomadController = async (req, res) => {
  try {
    const { result, success } = await getTripsByNomad(req.params.userId);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Something went wrong while fetching trips",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Trip has been fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getTripByNomadController",
      err: error,
      success: false,
    });
  }
};

module.exports = {
  createTripController,
  getTripByNomadController,
};
