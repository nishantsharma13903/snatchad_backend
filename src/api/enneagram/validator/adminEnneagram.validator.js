const Joi = require('joi');

const createEnneagramSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Enneagram Name must be a string",
        "required.any" : "Enneagram name is required",
        "string.min" : "Enneagram name must have at least 2 characters",
        "string.max" : "Enneagram name must have less than 30 characters"
    })
})

const updateEnneagramSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Enneagram Name must be a string",
        "required.any" : "Enneagram name is required",
        "string.min" : "Enneagram name must have at least 2 characters",
        "string.max" : "Enneagram name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createEnneagramSchema, updateEnneagramSchema}