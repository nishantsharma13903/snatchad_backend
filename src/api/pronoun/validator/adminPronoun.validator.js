const Joi = require('joi');

const createPronounSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Pronoun Name must be a string",
        "required.any" : "Pronoun name is required",
        "string.min" : "Pronoun name must have at least 2 characters",
        "string.max" : "Pronoun name must have less than 30 characters"
    })
})

const updatePronounSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Pronoun Name must be a string",
        "required.any" : "Pronoun name is required",
        "string.min" : "Pronoun name must have at least 2 characters",
        "string.max" : "Pronoun name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createPronounSchema, updatePronounSchema}