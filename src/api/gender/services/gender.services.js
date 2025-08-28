const { getAllGenders } = require("@/api/gender/repository/gender.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllGenders = async (page = 1, limit = 10, search = "") => {
  try {
    const result = await getAllGenders(page, limit, "name status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `Genders fetched successfully`,
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