const express = require("express");
const {
  login,
  logout,
  signup,
  updateProfile,
} = require("../controllers/auth.controller");
const {
  signupValidator,
  loginValidator,
  updateProfileValidator,
} = require("../utils/validators/authValidators");
const protectRoute = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImageMiddleware");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout); // we use post method for logout because it the best practice

router.put(
  "/update-profile",
  protectRoute.protect,
  updateProfileValidator,
  upload.single("profileImage"), // ← Multer parses image here
  updateProfile
);

router.get("/check", protectRoute.protect, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});
// router.put("/update-password", protectRoute.protect, updatePassword);

module.exports = router;
