const ResponseHandler = require("@/utils/response/responseHandler.utils");
const adminService = require("../services/admin.services");
const {
} = require("@/api/user/validator/admin.validator");

// Get user profile (mode-specific)
exports.getUserByStatus = async (req, res) => {
  try {
    const {status="", page=1, limit=1,search=""} = req.query;
    const response = await adminService.getUsersByStatus(status, page, limit,search);

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
      error.message || "Internal server error",
      500,
      {}
    );
  }
};

exports.getUserByMode = async (req, res) => {
  try {
    const mode = req?.query?.mode || "quiz"; // default to quiz mode

    if (!["quiz", "snatched", "versus"].includes(mode)) {
      return ResponseHandler.error(
        res,
        "Invalid Mode (Possible values are 'quiz','snatched', 'versus')",
        400,
        {}
      );
    }

    if (!userId) {
      return ResponseHandler.error(res, "User ID is required.", 400, {});
    }

    const response = await adminService.getUsersByMode(mode);

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
      error.message || "Internal server error",
      500,
      {}
    );
  }
};