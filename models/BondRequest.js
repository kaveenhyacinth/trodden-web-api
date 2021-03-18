const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bondRequestSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Nomad",
    },
    requestee: {
      type: ObjectId,
      ref: "Nomad",
    },
  },
  { timestamps: true }
);

const BondRequest = mongoose.model(
  "BondRequest",
  bondRequestSchema,
  "bondRequests"
);

module.exports = BondRequest;
