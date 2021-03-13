const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    des_name: String,
    des_ref: String,
    des_type: [],
  },
  { timestamps: true }
);

const Destination = mongoose.model(
  "Destination",
  destinationSchema,
  "destinations"
);

module.exports = Destination;
