// routes/quizAttempt.routes.js
const express = require("express");
const router = express.Router();

const { verifyToken } = require("@/middlewares/jwt.middleware");
const { jwtAudience } = require("@/config/jwt/jwt.config");
const { validateBody } = require("@/middlewares/validate.middleware");
const { attemptQuizSchema } = require("../validator/attemptQuiz.validator");
const quizAttemptController = require("../controller/attemptQuiz.controller");

// Attempt a quiz
router.post(
  "/attempt",
  verifyToken(jwtAudience.user),
  validateBody(attemptQuizSchema),
  quizAttemptController.attemptQuiz
);

// Get my quiz attempts
router.get(
  "/my-attempts",
  verifyToken(jwtAudience.user),
  quizAttemptController.getMyQuizAttempts
);

module.exports = router;
