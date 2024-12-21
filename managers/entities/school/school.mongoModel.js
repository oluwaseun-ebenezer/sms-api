const mongoose = require("mongoose");

// School Schema
const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const School = mongoose.model("School", schoolSchema);

module.exports = School;
