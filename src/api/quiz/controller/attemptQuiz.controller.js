// controllers/quizAttempt.controller.js
const quizAttemptService = require("../services/attemptQuiz.services");

exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const { quizId, answers } = req.body;

    const attempt = await quizAttemptService.createQuizAttempt(
      quizId,
      userId,
      answers
    );

    return res.status(201).json({
      success: true,
      message: "Quiz attempted successfully",
      result: attempt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to attempt quiz",
    });
  }
};

exports.getMyQuizAttempts = async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await quizAttemptService.getQuizAttemptsByUser(userId);

    return res.status(200).json({
      success: true,
      message: "Quiz attempts fetched successfully",
      result: attempts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch quiz attempts",
    });
  }
};
