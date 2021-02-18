const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const memorySchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "Nomad"
    },
    content: String,
    destination: String,
    tags: [String],
    heats: [
      {
        type: ObjectId,
        ref: "Nomad",
      },
    ],
    comments: [
      {
        commentor: {
          type: ObjectId,
          ref: "Nomad",
        },
        content: String,
      },
    ],
    images: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
  },
  { timestamps: true }
);

const Memory = mongoose.model("Memory", memorySchema, "memories");

module.exports = Memory;
