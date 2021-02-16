const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag_name: String
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema, "tags");

module.exports = Tag;
