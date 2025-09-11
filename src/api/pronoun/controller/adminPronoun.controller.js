const {
  handleUpdatePronoun,
  handleGetPronounById,
  handleCreatePronoun,
} = require("@/api/pronoun/services/adminPronoun.services");
const {
  createPronounSchema,
  updatePronounSchema,
} = require("@/api/pronoun/validator/adminPronoun.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewPronoun = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createPronounSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreatePronoun(name);

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

exports.updatePronoun = async (req, res) => {
  try {
    const { pronounId } = req.params;

    if (!pronounId) {
      return ResponseHandler.error(res, "Pronoun Id is required", 400, {});
    }

    const { error } = await updatePronounSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdatePronoun(pronounId, req.body);

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

exports.getPronounById = async (req, res) => {
  try {
    const { pronounId } = req.params;

    if (!pronounId) {
      return ResponseHandler.error(res, "Pronoun Id is required", 400, {});
    }

    const response = await handleGetPronounById(pronounId);

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
