const { getUsersByStatus, getUsersByMode } = require("@/api/user/repository/user.repository");
const ResponseHandler = require("@utils/response/responseHandler.utils");

// Fetch user details for a specific mode
exports.getUsersByMode = async (mode = "quiz") => {
  try {
    const result = await getUsersByMode(mode);

    return ResponseHandler.result(
      200,
      true,
      "Users fetched successfully.",
      result
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.getUsersByStatus = async (status, page,limit, search) => {
  try {
    const selectedFields = "-__v"
    const result = await getUsersByStatus(status,selectedFields, page,limit, search);

    return ResponseHandler.result(
      200,
      true,
      "Users fetched successfully.",
      result
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};