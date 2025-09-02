const { getAllDrinking } = require("@/api/drinking/repository/drinking.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllDrinking = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllDrinking(page, limit, "name status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `Drinking fetched successfully`,
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