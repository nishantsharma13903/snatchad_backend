const {
  handleGetAllSuggestedQuestion,
  handleCreateSuggestedQuestion,
  handleUpdateSuggestedQuestion,
  handleGetSuggestedQuestionById,
} = require("@/api/quiz/services/suggestedQuestion.services");
const {
  createSuggestedQueSchema,
  updateSuggestedQueSchema,
} = require("@/api/quiz/validator/suggestedQuestion.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewSuggestedQue = async (req, res) => {
  try {
    const { question } = req.body;

    const { error } = await createSuggestedQueSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateSuggestedQuestion(question);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.updateSuggestedQue = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return ResponseHandler.error(res, "Question Id is required", 400, {});
    }

    const { error } = await updateSuggestedQueSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateSuggestedQuestion(questionId, req.body);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.getSuggestedQueById = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return ResponseHandler.error(res, "Question Id is required", 400, {});
    }

    const response = await handleGetSuggestedQuestionById(questionId);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.getAllSuggestedQue = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const response = await handleGetAllSuggestedQuestion(page, limit, search);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};