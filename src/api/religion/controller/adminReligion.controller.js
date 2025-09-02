const {
  handleUpdateReligion,
  handleGetReligionById,
  handleCreateReligion,
} = require("@/api/religion/services/adminReligion.services");
const {
  createReligionSchema,
  updateReligionSchema,
} = require("@/api/religion/validator/adminReligion.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewReligion = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createReligionSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateReligion(name);

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

exports.updateReligion = async (req, res) => {
  try {
    const { religionId } = req.params;

    if (!religionId) {
      return ResponseHandler.error(res, "Religion Id is required", 400, {});
    }

    const { error } = await updateReligionSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateReligion(religionId, req.body);

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

exports.getReligionById = async (req, res) => {
  try {
    const { religionId } = req.params;

    if (!religionId) {
      return ResponseHandler.error(res, "Religion Id is required", 400, {});
    }

    const response = await handleGetReligionById(religionId);

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
