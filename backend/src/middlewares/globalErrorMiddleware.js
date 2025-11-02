const ApiError = require("../utils/apiError");

const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV || "development";

  // 🧠 Always print detailed error in console (for debugging)
  console.error("🔥 ERROR DETAILS 🔥");
  console.error("Message:", err.message);
  console.error("Path:", req.originalUrl);
  console.error("Method:", req.method);
  console.error("Status Code:", err.statusCode);
  console.error("Stack Trace:", err.stack);
  console.error("--------------------------------------");

  if (env === "development") {
    // 🧩 Send full details to client (useful in Postman/testing)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
      location: err.stack ? err.stack.split("\n")[1]?.trim() : "N/A",
    });
  } else if (env === "production") {
    // 🚨 Production mode: hide internal error details
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational
        ? err.message
        : "Something went wrong! Please try again later.",
    });
  }
};

module.exports = { notFound, globalError };
