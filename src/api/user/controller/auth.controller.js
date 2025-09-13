const ResponseHandler = require("@utils/response/responseHandler.utils");
const {
  sendOTP,
  verifyOTP,
  logOutUser,
  generateNewAuthTokens,
  handleGoogleAuth,
} = require("../services/auth.services");
const {
  sendAuthOTPSchema,
  verificationOTPSchema,
} = require("../validator/auth.validator");

// Controllers

exports.sendAuthOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const { error } = await sendAuthOTPSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await sendOTP(phone);

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

exports.verifyOTP = async (req, res) => {
  try {
    const {phone, otp} = req.body;

    const { error } = await verificationOTPSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

  const mode = req.query.mode || "quiz";
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const response = await verifyOTP(
      phone,
      otp,
      mode,
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

exports.logoutUser = async (req, res) => {
  try {
    const userId = req.token._id;

    const incomingToken = req.headers["authorization"];

    if (!userId) {
      return ResponseHandler.error(res, "User ID is required.", 400, {});
    }

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const loggedOutUser = await logOutUser(
      userId,
      incomingToken,
      userAgent,
      ipAddress
    );

    if (loggedOutUser) {
      return ResponseHandler.success(
        res,
        "User logged out successfully.",
        200,
        {}
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

exports.refreshAuthTokens = async (req, res) => {
  try {
    const userId = req.token._id;

    if (req.token.tokenType !== "refresh") {
      return ResponseHandler.error(
        res,
        "Invalid token type. Refresh token required.",
        400,
        {}
      );
    }

    let token = req.headers["authorization"];
    token = token && token.split(" ")[1]; // Extract token from Bearer scheme

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const tokenResult = await generateNewAuthTokens(
      userId,
      token,
      userAgent,
      ipAddress
    );

    if (tokenResult.success) {
      return ResponseHandler.success(
        res,
        "Tokens refreshed successfully.",
        200,
        tokenResult.result
      );
    } else {
      return ResponseHandler.error(
        res,
        tokenResult.message,
        tokenResult.statusCode,
        tokenResult.result
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