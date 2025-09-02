const {
  handleUpdateDrinking,
  handleGetDrinkingById,
  handleCreateDrinking,
} = require("@/api/drinking/services/adminDrinking.services");
const {
  createDrinkingSchema,
  updateDrinkingSchema,
} = require("@/api/drinking/validator/adminDrinking.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewDrinking = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createDrinkingSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateDrinking(name);

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

exports.updateDrinking = async (req, res) => {
  try {
    const { drinkingId } = req.params;

    if (!drinkingId) {
      return ResponseHandler.error(res, "Drinking Id is required", 400, {});
    }

    const { error } = await updateDrinkingSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateDrinking(drinkingId, req.body);

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

exports.getDrinkingById = async (req, res) => {
  try {
    const { drinkingId } = req.params;

    if (!drinkingId) {
      return ResponseHandler.error(res, "Drinking Id is required", 400, {});
    }

    const response = await handleGetDrinkingById(drinkingId);

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
