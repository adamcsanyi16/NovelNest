require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const requireAuth = require("./middlewares/requireAuth");

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
      width: 300,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
    },
  ],
};

const CoverOptions = {
  transformation: [
    {
      height: 450,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
    },
  ],
};

//MULTER SETUP
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB (adjust this value as needed)
  },
});

//TOKEN CREATION
const createToken = (_id, isAdmin, felhasznalonev) => {
  return jwt.sign({ _id, isAdmin, felhasznalonev }, process.env.SECRET, {
    expiresIn: "3h",
  });
};

//MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

//SOCKET.IO
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

const isValidToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  // Perform token validation logic using the isValidToken function
  if (token && isValidToken(token)) {
    return next();
  } else {
    return next(new Error("Authentication error: Invalid token"));
  }
});

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
      const koveteseimProfilkepArray = [];
      const kovetoimProfilkepArray = [];

      for (const koveteseimEmber of user.koveteseim) {
        const koveteseimUser = await User.findOne({
          felhasznalonev: koveteseimEmber,
        });
        if (koveteseimUser) {
          koveteseimProfilkepArray.push(koveteseimUser.profilkep);
        }
      }

      for (const kovetoEmber of user.kovetoim) {
        const kovetoUser = await User.findOne({ felhasznalonev: kovetoEmber });
        if (kovetoUser) {
          kovetoimProfilkepArray.push(kovetoUser.profilkep);
        }
      }

      const story = await Story.find({ szerzo: felhasznalonev });

      // legújabb sztori elküldése
      const publicStory = await Story.find({
        szerzo: felhasznalonev,
        isPublished: true,
      });
      publicStory.sort((a, b) => b.createdAt - a.createdAt);
      const legujabbStory = publicStory[0];

      res.status(200).send({
        viewFelhasznalonev: user.felhasznalonev,
        viewEmail: user.email,
        viewProfilkep: user.profilkep,
        viewBoritokep: user.boritokep,
        viewRolam: user.rolam,
        viewIsAdmin: user.isAdmin,
        viewKovetoimList: user.kovetoim,
        viewKovetoimListKep: kovetoimProfilkepArray,
        viewKoveteseimList: user.koveteseim,
        viewKoveteseimListKep: koveteseimProfilkepArray,
        viewKovetoim: user.kovetoim.length,
        viewKoveteseim: user.koveteseim.length,
        story: story,
        legujabbStory: legujabbStory,
      });
    } else {
      res.status(404).json({ msg: "A felhasználó nem található" });
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
    const { felhasznalonev, rolam, email, profilkep, boritokep } = req.body;
    const user = await User.findOne({ felhasznalonev });
    const profilkepNev = user.profilkepNev;
    const boritokepNev = user.boritokepNev;

    const updateProfilkep = async () => {
      if (profilkep !== "") {
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
                .then(() => console.log("Sikeres profilkép törlés"))
                .catch((error) => console.log(error));
            }
            await User.findOneAndUpdate(
              { felhasznalonev },
              {
                profilkep: result.secure_url,
                profilkepNev: result.public_id,
              }
            );
          }
        );
      }
    };

    const updateBoritokep = async () => {
      if (boritokep !== "") {
        cloudinary.uploader.upload(
          boritokep,
          CoverOptions,
          async (error, result) => {
            if (error) {
              console.log(error);
            }
            if (boritokepNev !== "") {
              cloudinary.api
                .delete_resources([boritokepNev], {
                  resource_type: "image",
                  invalidate: true,
                })
                .then(() => console.log("Sikeres borítókép törlés"))
                .catch((error) => console.log(error));
            }
            await User.findOneAndUpdate(
              { felhasznalonev },
              {
                boritokep: result.secure_url,
                boritokepNev: result.public_id,
              }
            );
          }
        );
      }
    };
    await updateProfilkep();
    await updateBoritokep();

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
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

//STORY ROUTES
app.post("/addstory", async (req, res) => {
  try {
    const {
      cim,
      szerzo,
      boritokep,
      leiras,
      karakterek,
      nyelv,
      kategoria,
      story,
      published,
    } = req.body;

    const storyLetezik = await Story.findOne({ cim });
    if (storyLetezik) {
      throw Error("Már létezik egy történet ezzel a címmel");
    }

    if (boritokep) {
      cloudinary.uploader.upload(
        boritokep,
        StoryCoverOptions,
        async (error, result) => {
          if (error) {
            console.log(error);
          }

          if (published) {
            const newStory = new Story({
              cim: cim,
              szerzo: szerzo,
              boritokep: result.secure_url,
              leiras: leiras,
              karakterek: karakterek,
              nyelv: nyelv,
              kategoria: kategoria,
              story: story,
              isPublished: published,
            });
            await newStory.save();
          } else {
            const newStory = new Story({
              cim: cim,
              szerzo: szerzo,
              boritokep: result.secure_url,
              leiras: leiras,
              karakterek: karakterek,
              nyelv: nyelv,
              kategoria: kategoria,
              story: story,
            });
            await newStory.save();
          }
          res.status(200).json({ msg: "Sikeres történet létrehozás!" });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/story", async (req, res) => {
  try {
    const story = await Story.find({ isPublished: true });
    res.status(200).json({ story });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt: " + error.message });
  }
});

app.post("/onestory", async (req, res) => {
  try {
    const id = req.body.id;
    const onestory = await Story.find({ _id: id });
    res.status(200).json({ onestory });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt: " + error.message });
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
