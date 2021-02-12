const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  title: String,
  desc: String,
}, {timestamps: true});

const Interest = mongoose.model("Interest", interestSchema, "interests");

module.exports = Interest;
