const { getAllTHC } = require("@/api/thc/repository/thc.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllTHC = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllTHC(page, limit, "name status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `THC fetched successfully`,
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