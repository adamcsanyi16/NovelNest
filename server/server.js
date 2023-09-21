const express = require("express");
const app = express();
const cors = require("cors");

/*MIDDLEWARES*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*ROUTES*/
app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3500;

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
