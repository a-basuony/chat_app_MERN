const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const ApiError = require("../utils/ApiError");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // you need to install cookie-parser and app.use(cookieParser())

    if (!token) {
      return next(
        new ApiError(
          "Not authorized to access this route, no token provided",
          401
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-__v -password");
    if (!user) {
      return next(new ApiError("User not found", 401));
    }
    req.user = user;

    next();
  } catch (error) {
    next(new ApiError("Invalid or expired token", 401));
  }
};
