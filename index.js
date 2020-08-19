require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const db = require("./models");
const cors = require('cors');

db.sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Fail Connect Database"));

app.use('/image', express.static('images'));
app.use(cors());
app.use(bodyParser.json());

const routerv1 = require("./routes/routerv1");
app.use("/api/v1", routerv1);

app.listen(port, () => console.log(`Server Run on Port ${port}`));
