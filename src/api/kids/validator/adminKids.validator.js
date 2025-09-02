const Joi = require('joi');

const createKidsSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Kids Name must be a string",
        "required.any" : "Kids name is required",
        "string.min" : "Kids name must have at least 2 characters",
        "string.max" : "Kids name must have less than 30 characters"
    })
})

const updateKidsSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Kids Name must be a string",
        "required.any" : "Kids name is required",
        "string.min" : "Kids name must have at least 2 characters",
        "string.max" : "Kids name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createKidsSchema, updateKidsSchema}