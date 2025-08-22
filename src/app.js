// src/app.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const apiRouter = require('./api');

const logger = require("./utils/logger/logger.utils");
const errorHandler = require("./middlewares/errorHandler.middleware");
const sanitizeRequest = require("./middlewares/sanitization.middleware");

const app = express();


// 1. Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(hpp());

// 2. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", apiLimiter);

// 3. Parsing Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));

app.use(sanitizeRequest); // This middleware recursively removes any keys containing '$' or '.' from req.body, req.query, and req.params to prevent NoSQL injection attacks.


// 4. Logging with Morgan → Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message?.trim()),
    },
  })
);

app.use('/api/v1', apiRouter)

// 5. Routes
app.get("/api", (req, res) => {
  res.send("Server Is Live ...");
});

// 6. Global Error Handler
app.use(errorHandler);

module.exports = app;
