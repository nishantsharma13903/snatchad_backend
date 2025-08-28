const Joi = require("joi");

const createHobbySchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.base": "Hobby Name must be a string",
    "required.any": "Hobby name is required",
    "string.min": "Hobby name must have at least 2 characters",
    "string.max": "Hobby name must have less than 30 characters",
  }),
});

const updateHobbySchema = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    "string.base": "Hobby Name must be a string",
    "required.any": "Hobby name is required",
    "string.min": "Hobby name must have at least 2 characters",
    "string.max": "Hobby name must have less than 30 characters",
  }),
  status: Joi.string().valid("Active", "Delete").optional().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'Active' or 'Delete'",
  }),
});

module.exports = { createHobbySchema, updateHobbySchema };
