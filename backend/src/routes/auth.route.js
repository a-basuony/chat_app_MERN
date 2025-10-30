const express = require("express");
const { login, logout, signup } = require("../controllers/auth.controller");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidators");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);

router.post("/login", loginValidator, login);
router.post("/logout", logout); // we use post method for logout because it the best practice

module.exports = router;
