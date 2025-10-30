const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const User = require("../model/user.model");
const createToken = require("../utils/createToken");
const {
  sendWelcomeEmail,
  sendLoginNotificationEmail,
} = require("../emails/emailHandlers");

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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Login failed : User not found", 404));
  }

  // 2. Check if password is correct
  const isMatch = await user.correctPassword(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Login failed : Invalid credentials", 401));
  }

  // 3. Create token
  const token = createToken(user._id, res);

  // after successful login
  sendLoginNotificationEmail(user.email, user.name).catch((err) =>
    console.error("Login email failed:", err.message)
  );

  res.status(200).json({
    message: "Login successful",
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true, // Prevent access from JS
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful", status: "success" });
};
