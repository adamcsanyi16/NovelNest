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
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const requireAuth = require("./middlewares/requireAuth");

//CLOUDINARY SETUP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

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

    const profilkep =
      "https://res.cloudinary.com/dfklaexjp/image/upload/v1698141392/user_fmootu.jpg";

    const newUser = new User({
      felhasznalonev,
      email,
      jelszo,
      profilkep: profilkep,
    });
    await newUser.save();
    console.log(newUser._id, newUser.isAdmin, newUser.felhasznalonev);
    const token = createToken(
      newUser._id,
      newUser.isAdmin,
      newUser.felhasznalonev
    );
    res.status(200).json({
      msg: "Sikeres regisztráció",
      token,
      profilkep,
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
    const profilkep = user.profilkep;
    console.log(felhasznalonev, token);
    res.status(200).json({
      msg: "Sikeres belépés",
      token,
      profilkep,
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
      res.status(200).json({
        viewFelhasznalonev: user.felhasznalonev,
        viewEmail: user.email,
        viewProfilkep: user.profilkep,
        viewRolam: user.rolam,
        viewIsAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ msg: "A  felhasználó nem található" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/userupdate", async (req, res) => {
  try {
    const { felhasznalonev, rolam, email, profilkep } = req.body;

    if (profilkep == "") {
      const updatedUser = await User.findOneAndUpdate(
        { felhasznalonev },
        {
          rolam,
          email,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "A felhasználó nem létezik!" });
      }
      res.status(200).json(updatedUser);
    } else {
      cloudinary.uploader.upload(profilkep, async (error, result) => {
        if (error) {
          console.log(error);
          throw new Error("Hiba történt az képfeltöltés közben");
        }
        const updatedUser = await User.findOneAndUpdate(
          { felhasznalonev },
          {
            rolam,
            email,
            profilkep: result.secure_url,
          }
        );
        if (!updatedUser) {
          return res.status(404).json({ error: "A felhasználó nem létezik!" });
        }
        res.status(200).json(updatedUser);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message});
  }
});

//STORY
app.post("/addstory", async (req, res) => {
  try {
    const { cim, szerzo, boritokep, story, karakterek, nyelv, kategoria } =
      req.body;

    const storyLetezik = await Story.findOne({ cim });
    if (storyLetezik) {
      throw Error("Már létezik egy történet ezzel a címmel");
    }

    cloudinary.uploader.upload(boritokep, async (error, result) => {
      if (error) {
        console.log(error);
        throw new Error("Hiba történt az képfeltöltés közben");
      }

      const newStory = new Story({
        cim: cim,
        szerzo: szerzo,
        boritokep: result.secure_url,
        story: story,
        karakterek: karakterek,
        nyelv: nyelv,
        kategoria: kategoria,
      });
      await newStory.save();
      res.status(200).json({ msg: "Sikeres történet létrehozás!" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/getInfos", async (req, res) => {
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
