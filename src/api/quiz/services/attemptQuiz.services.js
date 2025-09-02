// services/quizAttempt.service.js
const QuizAttempt = require("../model/attemptQuiz.model");
const Quiz = require("../model/userQuiz.model"); // assuming you already made Quiz model
const logger = require("@/utils/logger/logger.utils");

exports.createQuizAttempt = async (quizId, userId, answers) => {
  try {
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) throw new Error("Quiz not found");

    let score = 0;
    const maxScore = quiz.questions.length;

    // Calculate score
    for (const ans of answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === ans.questionId.toString()
      );
      if (!question) continue;

      const correctAnswers = question.correctAnswers || [];
      const selected = ans.selectedOptions || [];

      // Check if the selected matches exactly the correct ones
      const isCorrect =
        correctAnswers.length === selected.length &&
        correctAnswers.every((c) => selected.includes(c));

      if (isCorrect) score++;
    }

    // Save attempt
    const attempt = new QuizAttempt({
      quizId,
      userId,
      answers,
      score,
      maxScore,
    });

    return await attempt.save();
  } catch (error) {
    logger.error("Error creating quiz attempt", error);
    throw error;
  }
};

exports.getQuizAttemptsByUser = async (userId) => {
  try {
    return await QuizAttempt.find({ userId }).populate("quizId").lean();
  } catch (error) {
    logger.error("Error fetching quiz attempts", error);
    throw error;
  }
};
