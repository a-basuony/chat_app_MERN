const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
  level: "error", // can be info, warn, error, etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${stack || ""}`;
    })
  ),
  transports: [
    // Save all errors to file
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),

    // Print to console as well (useful for dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
