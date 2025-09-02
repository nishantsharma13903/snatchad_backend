const {
  createSuggestedQuestion,
  updateSuggestedQuestionById,
  checkSuggestedQuestionExistanceForUpdate,
  getSuggestedQuestionById,
  getSuggestedQuestionByName,
  deleteSuggestedQuestionByName,
  getAllSuggestedQuestion,
} = require("@/api/quiz/repository/suggestedQuestion.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateSuggestedQuestion = async (question) => {
  try {
    const existingSuggestedQuestion = await getSuggestedQuestionByName(question);

    if (existingSuggestedQuestion && existingSuggestedQuestion.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingSuggestedQuestion && existingSuggestedQuestion.status === "Delete") {
      await deleteSuggestedQuestionByName(question);
    }

    const newSuggestedQuestion = await createSuggestedQuestion(question);

    if (!newSuggestedQuestion) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating question",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Suggested Question created successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleUpdateSuggestedQuestion = async (id, payload) => {
  try {
    if (payload && payload?.question) {
      const isAlreadyExist = await checkSuggestedQuestionExistanceForUpdate(
        payload?.question,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteSuggestedQuestionByName(payload?.question);
    }

    const updatedSuggestedQuestion = await updateSuggestedQuestionById(id, payload);

    if (!updatedSuggestedQuestion) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating question",
        {}
      );
    }

    return ResponseHandler.result(200, true, `SuggestedQuestion updated successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetSuggestedQuestionById = async (id) => {
  try {
    const question = await getSuggestedQuestionById(id);

    if (!question) {
      return ResponseHandler.result(404, false, "SuggestedQuestion not found", {});
    }

    return ResponseHandler.result(200, true, `SuggestedQuestion fetched successfully`, question);
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetAllSuggestedQuestion = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllSuggestedQuestion(page, limit, "question status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `SuggestedQuestion fetched successfully`,
      result
    );
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};