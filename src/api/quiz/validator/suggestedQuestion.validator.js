const Joi = require('joi');

const createSuggestedQueSchema = Joi.object({
    question : Joi.string().min(2).max(300).required().messages({
        "string.base" : "Question must be a string",
        "required.any" : "Question is required",
        "string.min" : "Question must have at least 2 characters",
        "string.max" : "Question must have less than 300 characters"
    })
})

const updateSuggestedQueSchema = Joi.object({
   question : Joi.string().min(2).max(300).optional().messages({
        "string.base" : "Question must be a string",
        "required.any" : "Question is required",
        "string.min" : "Question must have at least 2 characters",
        "string.max" : "Question must have less than 300 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createSuggestedQueSchema, updateSuggestedQueSchema}