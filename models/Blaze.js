const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blazeSchema = new mongoose.Schema(
  {
    caravan: {
      type: ObjectId,
      ref: "Caravan",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    participants: [
      {
        type: ObjectId,
        ref: "Nomad",
      },
    ],
    title: String,
    desc: String,
    image: String,
    date: Date,
  },
  { timestamps: true }
);

const Blaze = mongoose.model("Blaze", blazeSchema, "blazes");

module.exports = Blaze;
