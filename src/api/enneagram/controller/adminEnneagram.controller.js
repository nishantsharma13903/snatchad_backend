const {
  handleUpdateEnneagram,
  handleGetEnneagramById,
  handleCreateEnneagram,
} = require("@/api/enneagram/services/adminEnneagram.services");
const {
  createEnneagramSchema,
  updateEnneagramSchema,
} = require("@/api/enneagram/validator/adminEnneagram.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewEnneagram = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createEnneagramSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateEnneagram(name);

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

exports.updateEnneagram = async (req, res) => {
  try {
    const { enneagramId } = req.params;

    if (!enneagramId) {
      return ResponseHandler.error(res, "Enneagram Id is required", 400, {});
    }

    const { error } = await updateEnneagramSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateEnneagram(enneagramId, req.body);

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

exports.getEnneagramById = async (req, res) => {
  try {
    const { enneagramId } = req.params;

    if (!enneagramId) {
      return ResponseHandler.error(res, "Enneagram Id is required", 400, {});
    }

    const response = await handleGetEnneagramById(enneagramId);

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
