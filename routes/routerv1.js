const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const {
  register,
  login,
  readUsers,
  deleteUser,
} = require("../controller/user");
const {
  readCountries,
  readDetailCountry,
  addCountry,
  editCountry,
} = require("../controller/country");
const {
    readTrips,
    readDetailTrip,
    addTrip,
    editTrip,
    deleteTrip,
  } = require("../controller/trip");
const { authenticated } = require("../middleware/auth");

// User
router.post("/register", register);
router.post("/login", login);
router.get("/users", readUsers);
router.delete("/users/:id", deleteUser);

// Country
router.get("/country", readCountries);
router.get("/country/:id", readDetailCountry);
router.post("/country", authenticated, addCountry);
router.patch("/country/:id", authenticated, editCountry);

// Trip
router.get("/trip", readTrips);
router.get("/trip/:id", readDetailTrip);
router.post("/trip", authenticated, fileUpload(), addTrip);
router.patch("/trip/:id", authenticated, fileUpload(), editTrip);
router.delete("/trip/:id", authenticated, deleteTrip)

module.exports = router;
