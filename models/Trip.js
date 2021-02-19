const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Nomad"
    },
    destinations: [String],
    locations: [{
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    }],
    participants: [
      {
        type: ObjectId,
        ref: "Nomad",
      },
    ],
    tags: [String],
    title: String,
    desc: String,
    start_date: Date,
    end_date: Date,
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema, "trips");

module.exports = Trip;
