const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    felhasznalonev: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jelszo: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilkep: {
      name: String,
      data: Buffer,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);