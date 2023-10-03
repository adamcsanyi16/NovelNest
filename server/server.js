require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const requireAuth = require("./middlewares/requireAuth");

//TOKEN CREATION
const createToken = (_id, isAdmin) => {
  return jwt.sign({ _id, isAdmin }, process.env.SECRET, {
    expiresIn: "3h",
  });
};

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/regisztral", async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    const letezik = await User.findOne({ email });
    if (letezik) {
      throw Error("Az email már létezik!");
    }
    const user = User.create({
      email,
      jelszo,
    });

    const token = createToken(user._id, user.isAdmin);
    res.status(200).json({ msg: "Sikeres regisztráció", email, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/belepes", async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Ez az email nincs regisztrálva!");
    }
    console.log(jelszo);
    const talalat = await bcrypt.compare(jelszo, user.jelszo);

    if (!talalat) {
      throw Error("A jelszó nem egyezik!");
    }
    const token = createToken(user._id, user.isAdmin);
    console.log(email, token);
    res.status(200).json({ msg: "Sikeres belépés", email, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.use(requireAuth);

//DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Sikeres adatbázis elérés!"))
  .catch(() => console.log(error.message));

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
