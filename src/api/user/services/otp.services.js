// otp.service.js
const {
  hashPlainText,
  comparePlainText,
} = require("@utils/security/hash.utils");
const ResponseHandler = require("@utils/response/responseHandler.utils");
const logger = require("@utils/logger/logger.utils");
const {
  deleteKeyFromRedis,
  setJSONInRedis,
  getJSONFromRedis,
} = require("@repository/redis/redis.repository");
const {
  otpSendThrottle,
  otpVerfiyThrottle,
} = require("@/config/otp/otp.config");
const { applyThrottlingRules } = require("@/utils/throttling/throttle.utils");

// Service Methods

exports.createOTP = async (phone, otp, expiresAt) => {
  try {
    if (!phone || !otp || !expiresAt) {
      throw new Error("All fields are required");
    }

    await deleteKeyFromRedis(`otp:${phone}`); // Ensure no previous OTP exists in Redis

    const hashedOtp = await hashPlainText(otp);

    // Store the OTP in Redis with an expiration time
    await setJSONInRedis(
      `otp:${phone}`,
      {
        otp: hashedOtp,
        expiresAt,
      },
      Math.round((expiresAt - Date.now()) / 1000)
    ); // Store in seconds

    return ResponseHandler.result(200, true, "OTP created successfully", {});
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.verifyOTP = async (phone, otp) => {
  try {
    if (!phone || !otp) {
      throw new Error("All fields are required");
    }
    const savedOTP = await getJSONFromRedis(`otp:${phone}`);

    if (!savedOTP || !savedOTP?.otp) {
      return ResponseHandler.result(404, false, "OTP not found.", {});
    }

    const result = await comparePlainText(otp, savedOTP?.otp);

    if (!result) {
      return ResponseHandler.result(200, false, "Invalid OTP.", {});
    }

    if (Date.now() > savedOTP.expiresAt) {
      return ResponseHandler.result(200, false, "OTP has been expired.", {});
    }

    return ResponseHandler.result(200, true, "OTP matched successfully", {});
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.throttleOtpSend = async (phone) => {
  try {

    const shortKey = `otp:send:short:${phone}`;
    const longKey = `otp:send:long:${phone}`;
    const dayKey = `otp:send:day:${phone}`;

    const { limits, windows } = otpSendThrottle;

    const result = await applyThrottlingRules([
      {
        key: shortKey,
        limit: limits.per30Sec,
        window: windows.per30Sec,
        errorMessage: `Too many requests. Try again after ${windows.per30Sec} seconds.`,
      },
      {
        key: longKey,
        limit: limits.perHour,
        window: windows.perHour,
        errorMessage: `Too many requests. Try again after ${
          windows.perHour / 60
        } minutes.`,
      },
      {
        key: dayKey,
        limit: limits.perDay,
        window: windows.perDay,
        errorMessage: `Too many requests. Try again after ${
          windows.perDay / 3600
        } hours.`,
      },
    ]);

    if (!result.success) {
      return ResponseHandler.result(
        result.statusCode,
        false,
        result.message || "Throttling failed",
        {}
      );
    }

    // If all checks passed, return success

    return ResponseHandler.result(200, true, "OTP throttling passed", {});
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.throttleOtpVerification = async (phone) => {
  try {
    if (!phone) {
      throw new Error("All fields are required");
    }

    const shortKey = `otp:verify:short:${phone}`;
    const longKey = `otp:verify:long:${phone}`;
    const dayKey = `otp:verify:day:${phone}`;

    const { limits, windows } = otpVerfiyThrottle;

    const result = await applyThrottlingRules([
      {
        key: shortKey,
        limit: limits.per30Sec,
        window: windows.per30Sec,
        errorMessage: `Too many requests. Try again after ${windows.per30Sec} seconds.`,
      },
      {
        key: longKey,
        limit: limits.perHour,
        window: windows.perHour,
        errorMessage: `Too many requests. Try again after ${
          windows.perHour / 60
        } minutes.`,
      },
      {
        key: dayKey,
        limit: limits.perDay,
        window: windows.perDay,
        errorMessage: `Too many requests. Try again after ${
          windows.perDay / 3600
        } hours.`,
      },
    ]);

    if (!result.success) {
      return ResponseHandler.result(
        result.statusCode,
        false,
        result.message || "Throttling failed",
        {}
      );
    }

    // If all checks passed, return success

    return ResponseHandler.result(200, true, "OTP throttling passed", {});
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};