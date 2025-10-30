const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      minlength: [6, "User email must be at least 6 characters long"],
    },
    phone: String,
    profileImage: {
      type: String,
      // default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "User password must be at least 6 characters long"],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // before run on save or create a document which is creating a new document
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

// ✅ Compare passwords during login
userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  // 1️⃣ Check if both passwords are provided
  if (!enteredPassword || !userPassword) {
    throw new Error(
      "Both entered and stored passwords are required for comparison."
    );
  }

  // 2️⃣ Ensure they are strings
  if (typeof enteredPassword !== "string" || typeof userPassword !== "string") {
    throw new Error("Passwords must be strings.");
  }

  // 3️⃣ Compare passwords securely using bcrypt
  const isMatch = await bcrypt.compare(enteredPassword, userPassword);

  // 4️⃣ Return boolean result
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
