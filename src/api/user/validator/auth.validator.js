const { otpLength } = require("@/config/otp/otp.config");
const Joi = require("joi");

const sendAuthOTPSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 to 15 digits long.",
      "any.required": "Phone number is required.",
      "string.base": "Phone number must be a string.",
    }),
});

const verificationOTPSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 to 15 digits long.",
      "any.required": "Phone number is required.",
      "string.base": "Phone number must be a string.",
    }),

  otp: Joi.string().length(otpLength).required().messages({
    "string.length": "OTP must be exactly {#otpLength} characters long.",
    "any.required": "OTP is required.",
    "string.base": "OTP must be a string.",
  }),

});

module.exports = {
  sendAuthOTPSchema,
  verificationOTPSchema,
};
