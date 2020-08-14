const express = require("express");
const router = express.Router();
const { register, login , readUsers, deleteUser  } = require("../controller/user");
const { readCountries, readDetailCountry, addCountry, editCountry } = require("../controller/country");

router.post("/register", register);
router.post("/login", login);
router.get("/users", readUsers);
router.delete("/users/:id", deleteUser);
router.get("/country", readCountries);
router.get("/country/:id", readDetailCountry);
router.post("/country", addCountry);
router.patch("/country/:id", editCountry);

module.exports = router;
