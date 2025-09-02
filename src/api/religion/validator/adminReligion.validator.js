const Joi = require('joi');

const createReligionSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Religion Name must be a string",
        "required.any" : "Religion name is required",
        "string.min" : "Religion name must have at least 2 characters",
        "string.max" : "Religion name must have less than 30 characters"
    })
})

const updateReligionSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Religion Name must be a string",
        "required.any" : "Religion name is required",
        "string.min" : "Religion name must have at least 2 characters",
        "string.max" : "Religion name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createReligionSchema, updateReligionSchema}