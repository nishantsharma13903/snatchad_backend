const ResponseHandler = require("../response/responseHandler.utils");
require("dotenv").config();

const { otpLength, otpExpiry } = require("@/config/otp/otp.config");

exports.generateOTP = (digit = otpLength, expiresAt=otpExpiry) => {

  try {
    const otp = Math.floor(
      10 ** (digit - 1) + Math.random() * 9 * 10 ** (digit - 1)
    );
    const expiryTime = new Date(Date.now() + expiresAt * 1000);

    return ResponseHandler.result(200, true, "OTP created successfully", {
      otp,
      expiresAt : expiryTime
    });
  } catch (error) {
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};