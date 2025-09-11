const {
  handleUpdateAlcohol,
  handleGetAlcoholById,
  handleCreateAlcohol,
} = require("@/api/alcohol/services/adminAlcohol.services");
const {
  createAlcoholSchema,
  updateAlcoholSchema,
} = require("@/api/alcohol/validator/adminAlcohol.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewAlcohol = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createAlcoholSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateAlcohol(name);

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

exports.updateAlcohol = async (req, res) => {
  try {
    const { alcoholId } = req.params;

    if (!alcoholId) {
      return ResponseHandler.error(res, "Alcohol Id is required", 400, {});
    }

    const { error } = await updateAlcoholSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateAlcohol(alcoholId, req.body);

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

exports.getAlcoholById = async (req, res) => {
  try {
    const { alcoholId } = req.params;

    if (!alcoholId) {
      return ResponseHandler.error(res, "Alcohol Id is required", 400, {});
    }

    const response = await handleGetAlcoholById(alcoholId);

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
