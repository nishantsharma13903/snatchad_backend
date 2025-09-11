const Joi = require('joi');

const createRaceSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Race Name must be a string",
        "required.any" : "Race name is required",
        "string.min" : "Race name must have at least 2 characters",
        "string.max" : "Race name must have less than 30 characters"
    })
})

const updateRaceSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Race Name must be a string",
        "required.any" : "Race name is required",
        "string.min" : "Race name must have at least 2 characters",
        "string.max" : "Race name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createRaceSchema, updateRaceSchema}