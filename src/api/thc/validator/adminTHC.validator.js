const Joi = require('joi');

const createTHCSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "THC Name must be a string",
        "required.any" : "THC name is required",
        "string.min" : "THC name must have at least 2 characters",
        "string.max" : "THC name must have less than 30 characters"
    })
})

const updateTHCSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "THC Name must be a string",
        "required.any" : "THC name is required",
        "string.min" : "THC name must have at least 2 characters",
        "string.max" : "THC name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createTHCSchema, updateTHCSchema}