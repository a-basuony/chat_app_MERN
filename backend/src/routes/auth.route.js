const express = require("express");
const { login, logout, signup } = require("../controllers/auth.controller");
const { signupValidator } = require("../utils/validators/authValidators");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);

router.get("/login", login);
router.get("/logout", logout);

module.exports = router;
