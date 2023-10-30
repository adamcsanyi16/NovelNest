require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const requireAuth = require("./middlewares/requireAuth");
const { count, log, error } = require("console");

//MODELS
const User = require("./models/User");
const Story = require("./models/Story");
const Category = require("./models/Category");
const Language = require("./models/Language");

//CLOUDINARY SETUP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const profileOptions = {
  transformation: [
    {
      width: 250,
      height: 250,
      crop: "scale",
      quality: "35",
      fetch_format: "auto",
    },
  ],
};

const StoryCoverOptions = {
  transformation: [
    {
      height: 400,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
    },
  ],
};

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

//REGISTRATION
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
      "https://res.cloudinary.com/dfklaexjp/image/upload/v1698234703/user_wx5ex5.jpg";

    const newUser = new User({
      felhasznalonev,
      email,
      jelszo,
      profilkep: profilkep,
    });
    await newUser.save();
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

//LOGIN
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

//AUTHENTICATED ROUTES
app.use(requireAuth);

//PROFILES
app.get(`/userinfo/:felhasznalonevKuld`, async (req, res) => {
  try {
    const felhasznalonev = req.params.felhasznalonevKuld;
    const user = await User.findOne({ felhasznalonev });

    if (user) {
      res.status(200).send({
        viewFelhasznalonev: user.felhasznalonev,
        viewEmail: user.email,
        viewProfilkep: user.profilkep,
        viewRolam: user.rolam,
        viewIsAdmin: user.isAdmin,
        viewKovetoim: user.kovetoim.length,
        viewKoveteseim: user.koveteseim.length,
      });
    } else {
      res.status(404).json({ msg: "A  felhasználó nem található" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post(`/userinfo/:felhasznalonevKuld`, async (req, res) => {
  const viewFelhasznalonev = req.params.felhasznalonevKuld;
  const felhasznalonev = req.body;
  try {
    const user = await User.findOne({
      felhasznalonev: felhasznalonev.felhasznalonev,
    });
    if (user.koveteseim.includes(viewFelhasznalonev)) {
      res.status(200).send({
        kovetem: true,
      });
    } else {
      res.status(200).send({
        kovetem: false,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//CUSTOMIZING USER PROFILES
app.post("/userupdate", async (req, res) => {
  try {
    const { felhasznalonev, rolam, email, profilkep } = req.body;
    const user = await User.findOne({ felhasznalonev });
    const profilkepNev = user.profilkepNev;
    console.log(profilkepNev);

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
      cloudinary.uploader.upload(
        profilkep,
        profileOptions,
        async (error, result) => {
          if (error) {
            console.log(error);
          }

          if (profilkepNev !== "user_wx5ex5") {
            cloudinary.api
              .delete_resources([profilkepNev], {
                resource_type: "image",
                invalidate: true,
              })
              .then(() => console.log("Sikeres törlés"))
              .catch((error) => console.log(error));
          }
          const updatedUser = await User.findOneAndUpdate(
            { felhasznalonev },
            {
              rolam,
              email,
              profilkep: result.secure_url,
              profilkepNev: result.public_id,
            }
          );
          if (!updatedUser) {
            return res
              .status(404)
              .json({ error: "A felhasználó nem létezik!" });
          }
          res.status(200).json(updatedUser);
        }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

//FOLLOWING SYSTEM
app.post("/bekovet", async (req, res) => {
  try {
    const { felhasznalonev, viewFelhasznalonev } = req.body;
    const bekovetettuser = await User.findOneAndUpdate(
      { felhasznalonev: viewFelhasznalonev },
      {
        $push: { kovetoim: felhasznalonev },
      }
    );
    const bekovetouser = await User.findOneAndUpdate(
      { felhasznalonev },
      {
        $push: { koveteseim: viewFelhasznalonev },
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

app.post("/kikovet", async (req, res) => {
  try {
    const { felhasznalonev, viewFelhasznalonev } = req.body;
    const bekovetettuser = await User.findOneAndUpdate(
      { felhasznalonev: viewFelhasznalonev },
      {
        $pull: { kovetoim: felhasznalonev },
      }
    );
    const bekovetouser = await User.findOneAndUpdate(
      { felhasznalonev },
      {
        $pull: { koveteseim: viewFelhasznalonev },
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

//STORY ADDING
app.post("/addstory", async (req, res) => {
  try {
    const { cim, szerzo, boritokep, story, karakterek, nyelv, kategoria } =
      req.body;

    const storyLetezik = await Story.findOne({ cim });
    if (storyLetezik) {
      throw Error("Már létezik egy történet ezzel a címmel");
    }

    cloudinary.uploader.upload(
      boritokep,
      StoryCoverOptions,
      async (error, result) => {
        if (error) {
          console.log(error);
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
      }
    );
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//GETTING DROPDOWNS DATA
app.get("/kategoria", async (req, res) => {
  try {
    const kategoria = await Category.find({});
    res.status(200).json({ kategoria });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt: " + error.message });
  }
});

app.post("/kategoria", async (req, res) => {
  try {
    const { kategoria } = req.body;
    if (kategoria != "") {
      const newCategory = new Category({
        kategoria,
      });
      await newCategory.save();
    }
    res.status(200).json({ msg: "Sikeres feltöltés!" });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt" + error.message });
  }
});

app.get("/nyelv", async (req, res) => {
  try {
    const nyelv = await Language.find({});
    res.status(200).json({ nyelv });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt: " + error.message });
  }
});

app.post("/nyelv", async (req, res) => {
  try {
    const { nyelv } = req.body;
    if (nyelv != "") {
      const newLanguage = new Language({
        nyelv,
      });
      await newLanguage.save();
    }
    res.status(200).json({ msg: "Sikeres feltöltés!" });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt" + error.message });
  }
});

app.get("/getInfos", async (req, res) => {
  try {
    const isAdmin = res.locals.isAdmin;
    const felhasznalonev = res.locals.felhasznalonev;

    const user = await User.findOne({ felhasznalonev });
    const profilkep = user.profilkep;
    res.status(200).json({ isAdmin, felhasznalonev, profilkep });
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
