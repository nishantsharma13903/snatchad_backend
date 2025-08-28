const { getAllHeight } = require("@/api/height/repository/height.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllHeight = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllHeight(page, limit, "heightInCm heightInFoot status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `Height fetched successfully`,
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