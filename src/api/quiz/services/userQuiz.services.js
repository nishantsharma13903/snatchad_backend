const ResponseHandler = require("@/utils/response/responseHandler.utils");
const logger = require("@/utils/logger/logger.utils");
const {
  createQuiz,
  getQuizById,
  listQuizzes,
  updateQuizStatus,
} = require("../repository/userQuiz.repo");
const { createAttempt } = require("../repository/attemptQuiz.repo");

const eqArrayAsSets = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  const sa = new Set(a),
    sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const v of sa) if (!sb.has(v)) return false;
  return true;
};

exports.handleCreateQuiz = async (payload, userId) => {
  try {
    // Auto-fill YES_NO options if not provided (defensive)
    payload.questions = payload.questions.map((q) => {
      if (q.type === "YES_NO" && (!q.options || q.options.length !== 2)) {
        return { ...q, options: ["Yes", "No"] };
      }
      return q;
    });

    const doc = { ...payload, createdBy: userId };
    const quiz = await createQuiz(doc);
    return ResponseHandler.result(201, true, "Quiz created successfully", {
      quizId: quiz._id,
    });
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetQuizForAttempt = async (quizId) => {
  try {
    const quiz = await getQuizById(quizId, { stripAnswers: true });
    if (!quiz || quiz.status !== "Active") {
      return ResponseHandler.result(
        404,
        false,
        "Quiz not found or not active",
        {}
      );
    }
    return ResponseHandler.result(200, true, "Quiz fetched", quiz);
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetQuizWithAnswers = async (quizId, requesterId) => {
  try {
    const quiz = await getQuizById(quizId, { stripAnswers: false });
    if (!quiz) return ResponseHandler.result(404, false, "Quiz not found", {});
    // Only creator can view answers (adjust if you have roles)
    if (String(quiz.createdBy) !== String(requesterId)) {
      return ResponseHandler.result(403, false, "Forbidden", {});
    }
    return ResponseHandler.result(200, true, "Quiz fetched", quiz);
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleListQuizzes = async ({
  createdBy,
  page,
  limit,
  status,
  search,
}) => {
  try {
    const result = await listQuizzes({
      createdBy,
      page,
      limit,
      status,
      search,
    });
    return ResponseHandler.result(200, true, "Quizzes fetched", result);
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleUpdateQuizStatus = async (quizId, status, requesterId) => {
  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) return ResponseHandler.result(404, false, "Quiz not found", {});
    if (String(quiz.createdBy) !== String(requesterId)) {
      return ResponseHandler.result(403, false, "Forbidden", {});
    }
    const updated = await updateQuizStatus(quizId, status);
    return ResponseHandler.result(200, true, "Quiz status updated", updated);
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleSubmitQuiz = async ({ quizId, answers }, userId) => {
  try {
    const quiz = await getQuizById(quizId, { stripAnswers: false });
    if (!quiz || quiz.status !== "Active") {
      return ResponseHandler.result(
        404,
        false,
        "Quiz not found or not active",
        {}
      );
    }

    // Index questions by _id for quick lookup
    const qMap = new Map(quiz.questions.map((q) => [String(q._id), q]));
    let score = 0;
    let maxScore = 0;

    for (const q of quiz.questions) {
      maxScore += q.points ?? 1;
    }

    // for (const ans of answers) {
    //   const q = qMap.get(String(ans.questionId));
    //   if (!q) continue; // ignore unknown questions
    //   // Validate indexes within bounds
    //   const withinBounds = (ans.selectedOptions || []).every(i => i >= 0 && i < (q.options?.length || 0));
    //   if (!withinBounds) continue;

    //   // Correct only if exact set match (no partial credit)
    //   if (eqArrayAsSets(ans.selectedOptions || [], q.correctAnswers || [])) {
    //     score += q.points ?? 1;
    //   }
    // }

    for (const ans of answers) {
      const q = qMap.get(String(ans.questionId));
      if (!q) continue;

      // Parse selectedOptions to numbers
      const selected = (ans.selectedOptions || []).map((i) => Number(i));

      const withinBounds = selected.every(
        (i) => i >= 0 && i < (q.options?.length || 0)
      );
      if (!withinBounds) continue;

      if (eqArrayAsSets(selected, q.correctAnswers || [])) {
        score += q.points ?? 1;
      }
    }

    const attemptDoc = {
      quizId,
      userId,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        selectedOptions: a.selectedOptions || [],
      })),
      score,
      maxScore,
    };

    const saved = await createAttempt(attemptDoc);
    return ResponseHandler.result(200, true, "Quiz submitted", {
      attemptId: saved._id,
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    });
  } catch (err) {
    logger.error(err);
    return ResponseHandler.result(
      500,
      false,
      err.message || "Internal Server Error",
      {}
    );
  }
};
