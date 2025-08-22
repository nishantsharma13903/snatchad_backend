// const OTP = require("../model/otp.model");

// exports.saveOTP = async (otpData) => {
//   const otp = new OTP(otpData);
//   return await otp.save();
// };

// exports.deletePreviousOTPs = async (identifier, type) => {
//   return await OTP.deleteMany({ identifier, type });
// };

// exports.getOTP = async (identifier, type) => {
//   return await OTP.findOne({identifier, type}).select("otp expiresAt").lean();
// }

