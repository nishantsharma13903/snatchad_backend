require("dotenv").config();

module.exports = {
  otpLength: parseInt(process.env.OTP_LENGTH, 10) || 6,
  otpExpiry: parseInt(process.env.OTP_EXPIRY, 10) || 300, // 5 minutes
  otpSendThrottle: {
    limits: {
      per30Sec: parseInt(process.env.OTP_SEND_LIMIT_PER_30S, 10) || 1,
      perHour: parseInt(process.env.OTP_SEND_LIMIT_PER_HOUR, 10) || 5,
      perDay: parseInt(process.env.OTP_SEND_LIMIT_PER_DAY, 10) || 10,
    },
    windows: {
      per30Sec: parseInt(process.env.OTP_SEND_WINDOW_30S, 10) || 30,
      perHour: parseInt(process.env.OTP_SEND_WINDOW_HOUR, 10) || 3600,
      perDay: parseInt(process.env.OTP_SEND_WINDOW_DAY, 10) || 86400,
    },
  },

  otpVerfiyThrottle: {
    limits: {
      per30Sec: parseInt(process.env.OTP_VERIFY_LIMIT_PER_30S, 10) || 3,
      perHour: parseInt(process.env.OTP_VERIFY_LIMIT_PER_HOUR, 10) || 6,
      perDay: parseInt(process.env.OTP_VERIFY_LIMIT_PER_DAY, 10) || 12,
    },
    windows: {
      per30Sec: parseInt(process.env.OTP_VERIFY_WINDOW_30S, 10) || 30,
      perHour: parseInt(process.env.OTP_VERIFY_WINDOW_HOUR, 10) || 3600,
      perDay: parseInt(process.env.OTP_VERIFY_WINDOW_DAY, 10) || 86400,
    },
  },
};
