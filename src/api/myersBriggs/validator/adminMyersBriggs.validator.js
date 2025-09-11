const Joi = require('joi');

const createMyersBriggsSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "MyersBriggs Name must be a string",
        "required.any" : "MyersBriggs name is required",
        "string.min" : "MyersBriggs name must have at least 2 characters",
        "string.max" : "MyersBriggs name must have less than 30 characters"
    })
})

const updateMyersBriggsSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "MyersBriggs Name must be a string",
        "required.any" : "MyersBriggs name is required",
        "string.min" : "MyersBriggs name must have at least 2 characters",
        "string.max" : "MyersBriggs name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createMyersBriggsSchema, updateMyersBriggsSchema}