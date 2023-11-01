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
    },
    boritokep: {
      type: String,
      required: true,
    },
    boritokepNev: {
      type: String,
    },
    leiras: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      default: "",
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
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("story", storySchema);
