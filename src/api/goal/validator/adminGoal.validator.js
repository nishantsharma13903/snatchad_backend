const Joi = require('joi');

const createGoalSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Goal Name must be a string",
        "required.any" : "Goal name is required",
        "string.min" : "Goal name must have at least 2 characters",
        "string.max" : "Goal name must have less than 30 characters"
    })
})

const updateGoalSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Goal Name must be a string",
        "required.any" : "Goal name is required",
        "string.min" : "Goal name must have at least 2 characters",
        "string.max" : "Goal name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createGoalSchema, updateGoalSchema}