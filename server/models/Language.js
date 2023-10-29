const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    nyelv: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("language", languageSchema);
