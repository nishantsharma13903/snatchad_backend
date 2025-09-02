const express = require("express");
const router = express.Router();

const { upload } = require("@/middlewares/multer.middleware");
const { verifyToken } = require("@/middlewares/jwt.middleware");
const { jwtAudience } = require("@/config/jwt/jwt.config");
const { validateBody } = require("@/middlewares/validate.middleware");

const quizController = require("../controller/userQuiz.controller");
const {
  createQuizSchema,
  updateQuizStatusSchema,
  submitQuizSchema,
} = require("../validator/userQuiz.validator");

// Create quiz (any authenticated user)
router.post(
  "/create",
  verifyToken(jwtAudience.user), // or admin if needed
  upload.none(),
  validateBody(createQuizSchema),
  quizController.createQuiz
);

// Get quiz for attempt (no answers exposed) — public or authenticated as you prefer
router.get(
  "/:quizId/for-attempt",
  upload.none(),
  quizController.getQuizForAttempt
);

// Get quiz with answers (creator only)
router.get(
  "/:quizId/with-answers",
  verifyToken(jwtAudience.user),
  upload.none(),
  quizController.getQuizWithAnswers
);

// List quizzes (optional filters)
router.get(
  "/list",
  upload.none(),
  quizController.listQuizzes
);

// Update quiz status (Draft/Active/Deleted) — creator only
router.post(
  "/:quizId/status",
  verifyToken(jwtAudience.user),
  upload.none(),
  validateBody(updateQuizStatusSchema),
  quizController.updateQuizStatus
);

// Submit quiz attempt
router.post(
  "/submit",
  verifyToken(jwtAudience.user),
  upload.none(),
  validateBody(submitQuizSchema),
  quizController.submitQuiz
);

module.exports = router;
