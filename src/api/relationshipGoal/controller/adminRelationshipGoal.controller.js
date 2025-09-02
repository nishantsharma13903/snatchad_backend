const {
  handleUpdateRelationshipGoal,
  handleGetRelationshipGoalById,
  handleCreateRelationshipGoal,
} = require("@/api/relationshipGoal/services/adminRelationshipGoal.services");
const {
  createRelationshipGoalSchema,
  updateRelationshipGoalSchema,
} = require("@/api/relationshipGoal/validator/adminRelationshipGoal.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewRelationshipGoal = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createRelationshipGoalSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateRelationshipGoal(name);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.updateRelationshipGoal = async (req, res) => {
  try {
    const { relationshipGoalId } = req.params;

    if (!relationshipGoalId) {
      return ResponseHandler.error(res, "RelationshipGoal Id is required", 400, {});
    }

    const { error } = await updateRelationshipGoalSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateRelationshipGoal(relationshipGoalId, req.body);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.getRelationshipGoalById = async (req, res) => {
  try {
    const { relationshipGoalId } = req.params;

    if (!relationshipGoalId) {
      return ResponseHandler.error(res, "RelationshipGoal Id is required", 400, {});
    }

    const response = await handleGetRelationshipGoalById(relationshipGoalId);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};
