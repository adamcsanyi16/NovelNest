require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Story = require("./models/Story");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const requireAuth = require("./middlewares/requireAuth");

//MULTER SETUP
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//TOKEN CREATION
const createToken = (_id, isAdmin, felhasznalonev) => {
  return jwt.sign({ _id, isAdmin, felhasznalonev }, process.env.SECRET, {
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

    const token = createToken(user._id, user.isAdmin,  user.felhasznalonev);
    const userprofilkep = imageBuffer.toString("base64");
    res.status(200).json({
      msg: "Sikeres regisztráció",
      felhasznalonev,
      token,
      userprofilkep,
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
    const token = createToken(user._id, user.isAdmin, user.felhasznalonev);
    const userprofilkep = user.profilkep.data.toString("base64");
    console.log(felhasznalonev, token);
    res.status(200).json({
      msg: "Sikeres belépés",
      token,
      userprofilkep,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.use(requireAuth);

app.get(`/userinfo/:felhasznalonevKuld`, async (req, res) => {
  try {
    const felhasznalonev = req.params.felhasznalonevKuld;
    const user = await User.findOne({ felhasznalonev });

    if (user) {
      res.status(200).send({
        viewFelhasznalonev: user.felhasznalonev,
        viewEmail: user.email,
        viewProfilkep: user.profilkep.data.toString("base64"),
        viewRolam: user.rolam,
        viewIsAdmin: user.isAdmin
      });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/userupdate", async (req, res) => {
  try {
    const { felhasznalonev, rolam, email } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { felhasznalonev },
      { rolam, email },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//STORY
app.post("/addstory", async (req, res) => {
  try {
    const { cim, szerzo, boritokep, story, karakterek, nyelv, kategoria } =
      req.body;

    const storyLetezik = await Story.findOne({ cim });
    if (storyLetezik) {
      throw Error("Már létezik egy történet ezzel a címmel")
    }

    const newStory = new Story({
      cim,
      szerzo,
      boritokep,
      story,
      karakterek,
      nyelv,
      kategoria,
    });
    await newStory.save();
    res.status(200).json({ msg: "Sikeres történet létrehozás!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/isAdmin", async (req, res) => {
  try {
    const isAdmin = res.locals.isAdmin;
    const felhasznalonev = res.locals.felhasznalonev;
    res.status(200).json({ isAdmin, felhasznalonev });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt: " + error.message });
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
