const Joi = require('joi');

const createDrinkingSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Drinking Name must be a string",
        "required.any" : "Drinking name is required",
        "string.min" : "Drinking name must have at least 2 characters",
        "string.max" : "Drinking name must have less than 30 characters"
    })
})

const updateDrinkingSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Drinking Name must be a string",
        "required.any" : "Drinking name is required",
        "string.min" : "Drinking name must have at least 2 characters",
        "string.max" : "Drinking name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createDrinkingSchema, updateDrinkingSchema}