const { updateAdminPassword, getAdminProfile } = require("@/api/admin/services/profile.services");
const { adminUpdatePasswordSchema } = require("@/api/admin/validator/auth.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleUpdateAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { error } = await adminUpdatePasswordSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const response = await updateAdminPassword(
      newPassword,
      oldPassword,
      userAgent,
      ipAddress
    );

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

exports.handleGetAdminProfile = async (req, res) => {
  try {
    const response = await getAdminProfile();

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