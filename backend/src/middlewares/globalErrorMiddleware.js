const ApiError = require("../utils/apiError");
const logger = require("../utils/logger"); // 👈 import logger

const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";

  // Log every error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode,
  });

  if (env === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      location: err.stack ? err.stack.split("\n")[1]?.trim() : "N/A",
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational
        ? err.message
        : "Something went wrong! Please try again later.",
    });
  }
};

module.exports = { notFound, globalError };
