const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    cim: {
      type: String,
      required: true,
      unique: true,
    },
    szerzo: {
      type: String,
      required: true,
      unique: true,
    },
    boritokep: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    karakterek: {
      type: String,
      required: true,
    },
    nyelv: {
      type: String,
      required: true,
    },
    kategoria: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("story", storySchema);
