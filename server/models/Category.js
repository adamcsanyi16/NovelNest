const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    kategoria: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
