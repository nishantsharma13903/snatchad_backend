const {
  handleUpdateGender,
  handleGetGenderById,
  handleCreateGender,
} = require("@/api/gender/services/adminGender.services");
const {
  createGenderSchema,
  updateGenderSchema,
} = require("@/api/gender/validator/adminGender.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewGender = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createGenderSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateGender(name);

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

exports.updateGender = async (req, res) => {
  try {
    const { genderId } = req.params;

    if (!genderId) {
      return ResponseHandler.error(res, "Gender Id is required", 400, {});
    }

    const { error } = await updateGenderSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateGender(genderId, req.body);

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

exports.getGenderById = async (req, res) => {
  try {
    const { genderId } = req.params;

    if (!genderId) {
      return ResponseHandler.error(res, "Gender Id is required", 400, {});
    }

    const response = await handleGetGenderById(genderId);

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
