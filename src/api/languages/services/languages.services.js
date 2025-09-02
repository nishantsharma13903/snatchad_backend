const { getAllLanguages } = require("@/api/languages/repository/languages.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllLanguages = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllLanguages(page, limit, "name status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `Languages fetched successfully`,
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