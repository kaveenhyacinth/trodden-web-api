const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const { ObjectId } = mongoose.Schema;

const nomadSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      minlength: 2,
      maxlength: 32,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      minlength: 2,
      maxlength: 32,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      minlength: 5,
      maxlength: 12,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encry_password: {
      type: String,
      require: true,
    },
    prof_bio: {
      type: String,
      maxlength: 160,
    },
    prof_img: Buffer,
    contact: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        // required: true
      },
      coordinates: {
        type: [Number],
        // required: true
      },
    },
    interests: [
      {
        type: ObjectId,
        ref: "Interest",
      },
    ],
    trips: [
      {
        type: ObjectId,
        ref: "Trip",
      },
    ],
    memories: [
      {
        type: ObjectId,
        ref: "Memory",
      },
    ],
    tribe: [
      {
        type: ObjectId,
        ref: "Nomad",
      },
    ],
    caravan: {
      type: ObjectId,
      ref: "Caravan",
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// mongoose virtual for password encryption
nomadSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

nomadSchema.methods = {
  // Encrypt password with sha256
  securePassword: function (plainpass) {
    if (!plainpass) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpass)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  // Authenticate user by password
  authenticate: function(plainpass) {
    return this.securePassword(plainpass) === this.encry_password;
  }
};

const Nomad = mongoose.model("Nomad", nomadSchema, "nomads");

module.exports = Nomad;
