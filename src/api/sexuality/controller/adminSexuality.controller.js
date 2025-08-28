const {
  handleUpdateSexuality,
  handleGetSexualityById,
  handleCreateSexuality,
} = require("@/api/sexuality/services/adminSexuality.services");
const {
  createSexualitySchema,
  updateSexualitySchema,
} = require("@/api/sexuality/validator/adminSexuality.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewSexuality = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createSexualitySchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateSexuality(name);

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

exports.updateSexuality = async (req, res) => {
  try {
    const { sexualityId } = req.params;

    if (!sexualityId) {
      return ResponseHandler.error(res, "Sexuality Id is required", 400, {});
    }

    const { error } = await updateSexualitySchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateSexuality(sexualityId, req.body);

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

exports.getSexualityById = async (req, res) => {
  try {
    const { sexualityId } = req.params;

    if (!sexualityId) {
      return ResponseHandler.error(res, "Sexuality Id is required", 400, {});
    }

    const response = await handleGetSexualityById(sexualityId);

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
