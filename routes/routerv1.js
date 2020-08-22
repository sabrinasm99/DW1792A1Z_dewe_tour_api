const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const {
  readUsers,
  readDetailUser,
  deleteUser,
  editUserPhoto,
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
const { addTransaction, readDetailTransaction, readOrders, editTransactionByAdmin, editTransactionByUser, readTransactionByName } = require("../controller/transaction")
const { registerUser,login, registerAdmin } = require("../controller/auth");
const { authenticated } = require("../middleware/auth");

// Auth
router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// User
router.get("/users", readUsers);
router.get("/user/:id", authenticated, readDetailUser);
router.patch("/user/:id", authenticated, fileUpload(), editUserPhoto);
router.delete("/user/:id", deleteUser);

// Country
router.get("/countries", readCountries);
router.get("/country/:id", readDetailCountry);
router.post("/country", authenticated, addCountry);
router.patch("/country/:id", authenticated, editCountry);

// Trip
router.get("/trips", readTrips);
router.get("/trip/:id", readDetailTrip);
router.post("/trip", authenticated, fileUpload(), addTrip);
router.patch("/trip/:id", authenticated, fileUpload(), editTrip);
router.delete("/trip/:id", authenticated, deleteTrip)

// Transaction
router.post("/transaction", authenticated, addTransaction);
router.patch("/transaction-admin/:id", authenticated, fileUpload(), editTransactionByAdmin);
router.patch("/transaction-user/:id", authenticated, fileUpload(), editTransactionByUser);
router.get("/transaction/:id", authenticated, readDetailTransaction);
router.get("/transaction-by-name/:id", authenticated, readTransactionByName);
router.get("/orders", readOrders);

module.exports = router;
