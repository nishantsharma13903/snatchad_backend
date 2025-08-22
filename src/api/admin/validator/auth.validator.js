const Joi = require("joi");

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
    "string.base": "Email must be a string.",
  }),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 64 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one number, and one special character.",
      "any.required": "Password is required.",
      "string.base": "Password must be a string.",
    }),
});

const adminUpdatePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 64 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one number, and one special character.",
      "any.required": "Password is required.",
      "string.base": "Password must be a string.",
    }),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 64 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one number, and one special character.",
      "any.required": "Password is required.",
      "string.base": "Password must be a string.",
    }),
});

module.exports = {
  adminLoginSchema,
  adminUpdatePasswordSchema
};
