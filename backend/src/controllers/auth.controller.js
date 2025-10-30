const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const User = require("../model/user.model");
const createToken = require("../utils/createToken");
const { sendWelcomeEmail } = require("../emails/emailHandlers");

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // 1. Create user // role  = by default user
  // we can use bcrypt to hash password in pre save middleware
  const user = await User.create({ name, email, password });

  if (!user) {
    return next(new ApiError("Signup failed : User not found", 404));
  }

  // 2. Create token
  const token = createToken(user._id, res);

  // 3- Send welcome email (non-blocking)
  try {
    sendWelcomeEmail(email, name, process.env.CLIENT_URL);
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err.message);
  }

  res.status(201).json({
    message: "Signup successful",
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
    token,
  });
});

exports.login = (req, res) => {
  res.send("Login endpoint!");
};
exports.logout = (req, res) => {
  res.send("logout endpoint!");
};
