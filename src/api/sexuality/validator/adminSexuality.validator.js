const Joi = require('joi');

const createSexualitySchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Sexuality Name must be a string",
        "required.any" : "Sexuality name is required",
        "string.min" : "Sexuality name must have at least 2 characters",
        "string.max" : "Sexuality name must have less than 30 characters"
    })
})

const updateSexualitySchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Sexuality Name must be a string",
        "required.any" : "Sexuality name is required",
        "string.min" : "Sexuality name must have at least 2 characters",
        "string.max" : "Sexuality name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createSexualitySchema, updateSexualitySchema}