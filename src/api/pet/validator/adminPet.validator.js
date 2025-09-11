const Joi = require('joi');

const createPetSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Pet Name must be a string",
        "required.any" : "Pet name is required",
        "string.min" : "Pet name must have at least 2 characters",
        "string.max" : "Pet name must have less than 30 characters"
    })
})

const updatePetSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Pet Name must be a string",
        "required.any" : "Pet name is required",
        "string.min" : "Pet name must have at least 2 characters",
        "string.max" : "Pet name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createPetSchema, updatePetSchema}