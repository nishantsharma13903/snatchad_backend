const ResponseHandler = require("@/utils/response/responseHandler.utils");
const {
  handleCreateQuiz,
  handleGetQuizForAttempt,
  handleGetQuizWithAnswers,
  handleListQuizzes,
  handleUpdateQuizStatus,
  handleSubmitQuiz,
} = require("../services/userQuiz.services");

exports.createQuiz = async (req, res) => {
  try {
    const userId = req.token._id; // assuming verifyToken sets req.user
    const response = await handleCreateQuiz(req.body, userId);
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};

exports.getQuizForAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const response = await handleGetQuizForAttempt(quizId);
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};

exports.getQuizWithAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.token._id;
    const response = await handleGetQuizWithAnswers(quizId, userId);
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};

exports.listQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;
    const createdBy = req.query.createdBy || undefined;
    const response = await handleListQuizzes({ createdBy, page, limit, status, search });
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};

exports.updateQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { status } = req.body;
    const userId = req.token._id;
    const response = await handleUpdateQuizStatus(quizId, status, userId);
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.token._id;
    const response = await handleSubmitQuiz(req.body, userId);
    return response.success
      ? ResponseHandler.success(res, response.message, response.statusCode, response.result)
      : ResponseHandler.error(res, response.message, response.statusCode, response.result);
  } catch (err) {
    return ResponseHandler.error(res, err.message || "Internal Server Error", 500, {});
  }
};