require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer")
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const validator = require("validator");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const requireAuth = require("./middlewares/requireAuth");


//MULTER SETUP
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    const { felhasznalonev, email, jelszo } = req.body;
    const letezik = await User.findOne({ email });
    
    if (letezik) {
      throw Error("Az email már létezik!");
    }
    if (!validator.isEmail(email)) {
      throw Error("Nem jó email formátum!");
    }
    const user = User.create({
      email,
      jelszo,
    });

    // Read the profile image from a file using fs.readFile
    const profilePath = path.join(__dirname, 'public', 'user.png');
    fs.readFile(profilePath, (err, imageBuffer) => {
      if (err) {
        res.status(404).send('Image not found');
      } else {
        const user = User.create({
          felhasznalonev,
          email,
          jelszo,
          profilkep: {
            name: 'user.png', // Set the image filename
            data: imageBuffer, // Save the binary data of the file
          },
        });
        const token = createToken(user._id, user.isAdmin);
        res.status(200).json({ msg: "Sikeres regisztráció", email, token });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/belepesJelszo", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Ez az email nincs regisztrálva!");
    }
    const jelszo = user.jelszo;

    res.status(200).json({ msg: jelszo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/belepes", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const token = createToken(user._id, user.isAdmin);
    console.log(email, token);
    res.status(200).json({ msg: "Sikeres belépés", email, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Sikeres adatbázis elérés!"))
  .catch(() => console.log(error.message));

app.use(requireAuth);

//DATABASE

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
