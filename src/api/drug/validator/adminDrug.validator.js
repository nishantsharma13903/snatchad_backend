const Joi = require('joi');

const createDrugSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Drug Name must be a string",
        "required.any" : "Drug name is required",
        "string.min" : "Drug name must have at least 2 characters",
        "string.max" : "Drug name must have less than 30 characters"
    })
})

const updateDrugSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Drug Name must be a string",
        "required.any" : "Drug name is required",
        "string.min" : "Drug name must have at least 2 characters",
        "string.max" : "Drug name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createDrugSchema, updateDrugSchema}