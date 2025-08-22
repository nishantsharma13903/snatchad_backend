// middleware/errorHandler.js

const logger = require("../utils/logger/logger.utils");

const errorHandler = (err, req, res, next) => {
  logger.error("Security or Server Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "An unexpected error occurred. Please try again later."
      : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
