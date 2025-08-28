const Joi = require('joi');

const createRelationshipSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "Relationship Name must be a string",
        "required.any" : "Relationship name is required",
        "string.min" : "Relationship name must have at least 2 characters",
        "string.max" : "Relationship name must have less than 30 characters"
    })
})

const updateRelationshipSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "Relationship Name must be a string",
        "required.any" : "Relationship name is required",
        "string.min" : "Relationship name must have at least 2 characters",
        "string.max" : "Relationship name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createRelationshipSchema, updateRelationshipSchema}