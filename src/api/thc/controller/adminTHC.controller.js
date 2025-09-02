const {
  handleUpdateTHC,
  handleGetTHCById,
  handleCreateTHC,
} = require("@/api/thc/services/adminTHC.services");
const {
  createTHCSchema,
  updateTHCSchema,
} = require("@/api/thc/validator/adminTHC.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewTHC = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createTHCSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateTHC(name);

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

exports.updateTHC = async (req, res) => {
  try {
    const { thcId } = req.params;

    if (!thcId) {
      return ResponseHandler.error(res, "THC Id is required", 400, {});
    }

    const { error } = await updateTHCSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateTHC(thcId, req.body);

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

exports.getTHCById = async (req, res) => {
  try {
    const { thcId } = req.params;

    if (!thcId) {
      return ResponseHandler.error(res, "THC Id is required", 400, {});
    }

    const response = await handleGetTHCById(thcId);

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
