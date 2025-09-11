const Joi = require('joi');

const createAlcoholSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Alcohol Name must be a string",
        "required.any" : "Alcohol name is required",
        "string.min" : "Alcohol name must have at least 2 characters",
        "string.max" : "Alcohol name must have less than 30 characters"
    })
})

const updateAlcoholSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Alcohol Name must be a string",
        "required.any" : "Alcohol name is required",
        "string.min" : "Alcohol name must have at least 2 characters",
        "string.max" : "Alcohol name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createAlcoholSchema, updateAlcoholSchema}