const Joi = require("joi");

// Create validator
const createHeightSchema = Joi.object({
  heightInCm: Joi.number().min(100).max(250).required().messages({
    "number.base": "Height must be a number",
    "any.required": "Height is required",
    "number.min": "Height must be at least {#limit} cm",
    "number.max": "Height must be less than {#limit} cm",
  }),
});

// Update validator
const updateHeightSchema = Joi.object({
  heightInCm: Joi.number().min(100).max(250).optional().messages({
    "number.base": "Height must be a number",
    "number.min": "Height must be at least {#limit} cm",
    "number.max": "Height must be less than {#limit} cm",
  }),
  status: Joi.string().valid("Active", "Delete").optional().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'Active' or 'Delete'",
  }),
});

module.exports = { createHeightSchema, updateHeightSchema };
