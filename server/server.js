require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
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

/*app.get("/userprofile", async (req, res) => {
  try {
    try {
      const users = await User.find({});
      res.status(200).json({ msg: users });
    } catch (error) {
      res.status(500).json({ msg: "Valami hiba történt" + error.message });
    }
  } catch (error) {}
});*/

app.post("/regisztral", async (req, res) => {
  try {
    const { felhasznalonev, email, jelszo } = req.body;
    const emailLetezik = await User.findOne({ email });
    const felhasznalonevLetezik = await User.findOne({ felhasznalonev });

    if (felhasznalonevLetezik) {
      throw Error("A felhasználónév már létezik!");
    }
    if (emailLetezik) {
      throw Error("Az email már létezik!");
    }
    if (!validator.isEmail(email)) {
      throw Error("Nem jó email formátum!");
    }

    const profilePath = path.join(__dirname, "public", "user.jpg");
    const profileFilename = path.basename(profilePath);
    const readFileAsync = promisify(fs.readFile);

    const imageBuffer = await readFileAsync(profilePath);

    const user = User.create({
      felhasznalonev,
      email,
      jelszo,
      profilkep: {
        name: profileFilename,
        data: imageBuffer,
      },
    });

    //const userprofilkep = user.profilkep;
    //const userfelhasznalonev = user.felhasznalonev

    const token = createToken(user._id, user.isAdmin);
    res.status(200).json({
      msg: "Sikeres regisztráció",
      felhasznalonev,
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/belepesJelszo", async (req, res) => {
  try {
    const { felhasznalonev } = req.body;
    const user = await User.findOne({ felhasznalonev });
    if (!user) {
      throw Error("Ez a felhasználó nincs regisztrálva!");
    }
    const jelszo = user.jelszo;

    res.status(200).json({ msg: jelszo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/belepes", async (req, res) => {
  try {
    const { felhasznalonev } = req.body;
    const user = await User.findOne({ felhasznalonev });
    const token = createToken(user._id, user.isAdmin);
    const userprofilkep = user.profilkep.data.toString("base64");
    console.log(felhasznalonev, token);
    res.status(200).json({
      msg: "Sikeres belépés",
      felhasznalonev,
      token,
      userprofilkep,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.use(requireAuth);

app.get("/userinfo", async (req, res) => {
  try {
    const users = await User.find({});
    const userprofilkep = users.profilkep.data.toString("base64");
    console.log(userprofilkep);
    res.status(200).json({ users, userprofilkep});
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt" + error.message });
  }
});

//DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Sikeres adatbázis elérés!"))
  .catch(() => console.log(error.message));

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
