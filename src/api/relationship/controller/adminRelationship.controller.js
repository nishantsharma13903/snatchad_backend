const {
  handleUpdateRelationship,
  handleGetRelationshipById,
  handleCreateRelationship,
} = require("@/api/relationship/services/adminRelationship.services");
const {
  createRelationshipSchema,
  updateRelationshipSchema,
} = require("@/api/relationship/validator/adminRelationship.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewRelationship = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createRelationshipSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateRelationship(name);

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

exports.updateRelationship = async (req, res) => {
  try {
    const { relationshipId } = req.params;

    if (!relationshipId) {
      return ResponseHandler.error(res, "Relationship Id is required", 400, {});
    }

    const { error } = await updateRelationshipSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateRelationship(relationshipId, req.body);

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

exports.getRelationshipById = async (req, res) => {
  try {
    const { relationshipId } = req.params;

    if (!relationshipId) {
      return ResponseHandler.error(res, "Relationship Id is required", 400, {});
    }

    const response = await handleGetRelationshipById(relationshipId);

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
