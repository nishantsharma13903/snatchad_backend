const Joi = require('joi');

const createRelationshipGoalSchema = Joi.object({
    name : Joi.string().min(2).max(30).required().messages({
        "string.base" : "RelationshipGoal Name must be a string",
        "required.any" : "RelationshipGoal name is required",
        "string.min" : "RelationshipGoal name must have at least 2 characters",
        "string.max" : "RelationshipGoal name must have less than 30 characters"
    })
})

const updateRelationshipGoalSchema = Joi.object({
    name : Joi.string().min(2).max(30).optional().messages({
        "string.base" : "RelationshipGoal Name must be a string",
        "required.any" : "RelationshipGoal name is required",
        "string.min" : "RelationshipGoal name must have at least 2 characters",
        "string.max" : "RelationshipGoal name must have less than 30 characters"
    }),
    status: Joi.string().valid("Active", "Delete").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'Active' or 'Delete'"
    })
})

module.exports = {createRelationshipGoalSchema, updateRelationshipGoalSchema}