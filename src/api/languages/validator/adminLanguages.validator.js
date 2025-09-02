const Joi = require('joi');

const createLanguagesSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Languages Name must be a string",
        "required.any" : "Languages name is required",
        "string.min" : "Languages name must have at least 2 characters",
        "string.max" : "Languages name must have less than 30 characters"
    })
})

const updateLanguagesSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Languages Name must be a string",
        "required.any" : "Languages name is required",
        "string.min" : "Languages name must have at least 2 characters",
        "string.max" : "Languages name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createLanguagesSchema, updateLanguagesSchema}