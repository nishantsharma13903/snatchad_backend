const {
  handleUpdateHeight,
  handleGetHeightById,
  handleCreateHeight,
} = require("@/api/height/services/adminHeight.services");
const {
  createHeightSchema,
  updateHeightSchema,
} = require("@/api/height/validator/adminHeight.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewHeight = async (req, res) => {
  try {
    const { heightInCm } = req.body;

    const { error } = await createHeightSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateHeight(heightInCm);

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

exports.updateHeight = async (req, res) => {
  try {
    const { heightId } = req.params;

    if (!heightId) {
      return ResponseHandler.error(res, "Height Id is required", 400, {});
    }

    const { error } = await updateHeightSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateHeight(heightId, req.body);

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

exports.getHeightById = async (req, res) => {
  try {
    const { heightId } = req.params;

    if (!heightId) {
      return ResponseHandler.error(res, "Height Id is required", 400, {});
    }

    const response = await handleGetHeightById(heightId);

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
