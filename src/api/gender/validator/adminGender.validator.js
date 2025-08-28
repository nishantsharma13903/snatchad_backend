const Joi = require('joi');

const createGenderSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Gender Name must be a string",
        "required.any" : "Gender name is required",
        "string.min" : "Gender name must have at least 2 characters",
        "string.max" : "Gender name must have less than 30 characters"
    })
})

const updateGenderSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Gender Name must be a string",
        "required.any" : "Gender name is required",
        "string.min" : "Gender name must have at least 2 characters",
        "string.max" : "Gender name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createGenderSchema, updateGenderSchema}