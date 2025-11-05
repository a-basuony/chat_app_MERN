const jwt = require("jsonwebtoken");

const createToken = (id, res) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Extract numeric part for cookie (e.g., 7 from "7d")
  const days = parseInt(process.env.JWT_EXPIRES_IN, 10) || 7;

  res.cookie("jwt", token, {
    maxAge: days * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent xss attacks: cross-site scripting,
  sameSite:  "strict",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });

  return token;
};

module.exports = createToken;

// secure depend on environment
// development => http://localhost:8000 // so no s in http here is secure = false
// production => https://localhost:8000 // so s in https here is secure = true
