const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const User = require("../model/user.model");
const createToken = require("../utils/createToken");
const cloudinary = require("../config/cloudinary");
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

// @desc    check auth
// @route   POST /api/auth/check
// @access  Public
// controllers/authController.js
exports.checkAuth = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
      },
    },
  });
};


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

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { name, email, phone } = req.body;

  // ✅ Convert file buffer to base64 (for Cloudinary)
  const profileImage =
    req.body.profileImage ||
    (req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null);

  // 1️⃣ Find user
  const user = await User.findById(userId);
  if (!user) return next(new ApiError("User not found", 404));

  // 2️⃣ Update basic fields (if provided)
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  console.log("Uploading image...", profileImage ? "✅ found" : "❌ missing");

  // 3️⃣ Handle profile image upload
  if (profileImage) {
    try {
      // 3.1️⃣ Delete old image from Cloudinary (if exists)
      if (user.profileImage) {
        const oldPublicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `users/profile_images/${oldPublicId}`
        );
      }

      // 3.2️⃣ Upload new image
      const uploadResponse = await cloudinary.uploader.upload(profileImage, {
        folder: "users/profile_images",
        public_id: `${user._id}_profile`,
        overwrite: true,
      });

      user.profileImage = uploadResponse.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error.message, error);
      return next(new ApiError("Image upload failed. Please try again.", 500));
    }
  }

  // 4️⃣ Save updated user
  await user.save();

  // 5️⃣ Respond to client
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    },
  });
});
