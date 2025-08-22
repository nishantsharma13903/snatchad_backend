const {
  verifyLoginCredentails,
  logOutAdmin,
} = require("@/api/admin/services/auth.services");
const {
  adminLoginSchema,
} = require("@/api/admin/validator/auth.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = await adminLoginSchema.validateAsync(req.body);

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

    const response = await verifyLoginCredentails(
      email,
      password,
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

exports.handleAdminLogout = async (req, res) => {
  try {
    const adminId = req?.token?._id;

    const token = req.headers["authorization"];

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const response = await logOutAdmin(adminId, token, userAgent, ipAddress);

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