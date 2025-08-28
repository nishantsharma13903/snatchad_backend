const {
  handleUpdateInterest,
  handleGetInterestById,
  handleCreateInterest,
} = require("@/api/interest/services/adminInterest.services");
const {
  createInterestSchema,
  updateInterestSchema,
} = require("@/api/interest/validator/adminInterest.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewInterest = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createInterestSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateInterest(name);

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

exports.updateInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!interestId) {
      return ResponseHandler.error(res, "Interest Id is required", 400, {});
    }

    const { error } = await updateInterestSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateInterest(interestId, req.body);

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

exports.getInterestById = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!interestId) {
      return ResponseHandler.error(res, "Interest Id is required", 400, {});
    }

    const response = await handleGetInterestById(interestId);

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
