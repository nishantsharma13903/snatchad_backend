const {
  handleUpdateKids,
  handleGetKidsById,
  handleCreateKids,
} = require("@/api/kids/services/adminKids.services");
const {
  createKidsSchema,
  updateKidsSchema,
} = require("@/api/kids/validator/adminKids.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewKids = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createKidsSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateKids(name);

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

exports.updateKids = async (req, res) => {
  try {
    const { kidsId } = req.params;

    if (!kidsId) {
      return ResponseHandler.error(res, "Kids Id is required", 400, {});
    }

    const { error } = await updateKidsSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateKids(kidsId, req.body);

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

exports.getKidsById = async (req, res) => {
  try {
    const { kidsId } = req.params;

    if (!kidsId) {
      return ResponseHandler.error(res, "Kids Id is required", 400, {});
    }

    const response = await handleGetKidsById(kidsId);

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
