const Joi = require('joi');

const createInterestSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Interest Name must be a string",
        "required.any" : "Interest name is required",
        "string.min" : "Interest name must have at least 2 characters",
        "string.max" : "Interest name must have less than 30 characters"
    })
})

const updateInterestSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Interest Name must be a string",
        "required.any" : "Interest name is required",
        "string.min" : "Interest name must have at least 2 characters",
        "string.max" : "Interest name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createInterestSchema, updateInterestSchema}