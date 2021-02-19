const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const caravanSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Nomad",
    },
    caravan_name: String,
    desc: String,
    display_img: String,
    interests: [
      {
        type: ObjectId,
        ref: "Interest",
      },
    ],
    nomads: [{
      type: ObjectId,
      ref: "Nomad",
    }],
  },
  { timestamps: true }
);

const Caravan = mongoose.model("Caravan", caravanSchema, "caravans");

module.exports = Caravan;
