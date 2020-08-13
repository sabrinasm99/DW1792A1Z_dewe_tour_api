const express = require("express");
const router = express.Router();
const { register, login , readUser, deleteUser } = require("../controller/user");

router.post("/register", register);
router.post("/login", login);
router.get("/users", readUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
