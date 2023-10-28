const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  nev: {
    type: String,
  },
});

module.exports = mongoose.model("category", categorySchema);
