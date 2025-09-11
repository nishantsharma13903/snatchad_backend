const {
  handleUpdatePoliticalStance,
  handleGetPoliticalStanceById,
  handleCreatePoliticalStance,
} = require("@/api/politicalStance/services/adminPoliticalStance.services");
const {
  createPoliticalStanceSchema,
  updatePoliticalStanceSchema,
} = require("@/api/politicalStance/validator/adminPoliticalStance.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewPoliticalStance = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createPoliticalStanceSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreatePoliticalStance(name);

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

exports.updatePoliticalStance = async (req, res) => {
  try {
    const { politicalStanceId } = req.params;

    if (!politicalStanceId) {
      return ResponseHandler.error(res, "PoliticalStance Id is required", 400, {});
    }

    const { error } = await updatePoliticalStanceSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdatePoliticalStance(politicalStanceId, req.body);

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

exports.getPoliticalStanceById = async (req, res) => {
  try {
    const { politicalStanceId } = req.params;

    if (!politicalStanceId) {
      return ResponseHandler.error(res, "PoliticalStance Id is required", 400, {});
    }

    const response = await handleGetPoliticalStanceById(politicalStanceId);

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
