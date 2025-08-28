const { getAllHobby } = require("@/api/hobby/repository/hobby.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleGetAllHobby = async (page = 1, limit = 1, search = "") => {
  try {
    const result = await getAllHobby(page, limit, "name icon status _id", search);

    return ResponseHandler.result(
      200,
      true,
      `Hobby fetched successfully`,
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