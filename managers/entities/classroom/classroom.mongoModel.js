const mongoose = require("mongoose");

// Classroom Schema
const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    resources: [String],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
