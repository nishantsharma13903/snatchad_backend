const {
  handleUpdateLanguages,
  handleGetLanguagesById,
  handleCreateLanguages,
} = require("@/api/languages/services/adminLanguages.services");
const {
  createLanguagesSchema,
  updateLanguagesSchema,
} = require("@/api/languages/validator/adminLanguages.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewLanguages = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createLanguagesSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateLanguages(name);

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

exports.updateLanguages = async (req, res) => {
  try {
    const { languagesId } = req.params;

    if (!languagesId) {
      return ResponseHandler.error(res, "Languages Id is required", 400, {});
    }

    const { error } = await updateLanguagesSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateLanguages(languagesId, req.body);

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

exports.getLanguagesById = async (req, res) => {
  try {
    const { languagesId } = req.params;

    if (!languagesId) {
      return ResponseHandler.error(res, "Languages Id is required", 400, {});
    }

    const response = await handleGetLanguagesById(languagesId);

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
