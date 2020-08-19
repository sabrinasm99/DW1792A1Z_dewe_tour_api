const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const {
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
const { addTransaction, readDetailTransaction, readOrders, editTransaction } = require("../controller/transaction")
const { registerUser,login, registerAdmin } = require("../controller/auth");
const { authenticated } = require("../middleware/auth");

// Auth
router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// User
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

// Transaction
router.post("/transaction", authenticated, fileUpload(), addTransaction);
router.patch("/transaction/:id", authenticated, editTransaction);
router.get("/transaction/:id", readDetailTransaction);
router.get("/orders", readOrders);

module.exports = router;
