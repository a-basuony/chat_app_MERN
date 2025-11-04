const { check } = require("express-validator");

const User = require("../../model/user.model");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Name must be less than 30 characters long"),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  check("phone")
    .trim()
    .optional()
    .isMobilePhone("ar-EG ar-SA")
    .withMessage("Phone number is invalid"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
 ,

  check("confirmPassword")
    .if(check("password").exists())
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isLength({ min: 6 })
    .withMessage("Confirm Password must be at least 6 characters long")   .custom(async (val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email not found");
      }
      return true;
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

exports.updateProfileValidator = [
  check("name")
    .trim()
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Name must be less than 30 characters long"),

  check("email")
    .trim()
    .optional()
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  check("phone")
    .trim()
    .optional()
    .isMobilePhone("ar-EG ar-SA")
    .withMessage("Phone number is invalid"),

  check("profileImage")
    .trim()
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  validatorMiddleware,
];
