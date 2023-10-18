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
    rolam: {
      type: String,
      default: "Rólam...",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilkep: {
      name: String,
      data: Buffer,
    },
    koveteseim: {
      type: Array,
    },
    kovetoim: {
      type: Array,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);