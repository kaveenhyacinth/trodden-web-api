const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Nomad",
    },
    dayPlans: [
      {
        day: Number,
        note: String,
        selectedLocations: [
          {
            latitude: Number,
            longitude: Number,
          },
        ],
      },
    ],
    participants: [
      {
        type: ObjectId,
        ref: "Nomad",
      },
    ],
    isPrivate: {
      type: Number,
      default: 0,
    },
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
