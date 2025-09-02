const {
  handleUpdateSmoking,
  handleGetSmokingById,
  handleCreateSmoking,
} = require("@/api/smoking/services/adminSmoking.services");
const {
  createSmokingSchema,
  updateSmokingSchema,
} = require("@/api/smoking/validator/adminSmoking.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewSmoking = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createSmokingSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateSmoking(name);

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

exports.updateSmoking = async (req, res) => {
  try {
    const { smokingId } = req.params;

    if (!smokingId) {
      return ResponseHandler.error(res, "Smoking Id is required", 400, {});
    }

    const { error } = await updateSmokingSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateSmoking(smokingId, req.body);

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

exports.getSmokingById = async (req, res) => {
  try {
    const { smokingId } = req.params;

    if (!smokingId) {
      return ResponseHandler.error(res, "Smoking Id is required", 400, {});
    }

    const response = await handleGetSmokingById(smokingId);

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
