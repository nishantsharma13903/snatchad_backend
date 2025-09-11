const {
  handleUpdateDateIdea,
  handleGetDateIdeaById,
  handleCreateDateIdea,
} = require("@/api/dateIdea/services/adminDateIdea.services");
const {
  createDateIdeaSchema,
  updateDateIdeaSchema,
} = require("@/api/dateIdea/validator/adminDateIdea.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewDateIdea = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createDateIdeaSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateDateIdea(name);

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

exports.updateDateIdea = async (req, res) => {
  try {
    const { dateIdeaId } = req.params;

    if (!dateIdeaId) {
      return ResponseHandler.error(res, "DateIdea Id is required", 400, {});
    }

    const { error } = await updateDateIdeaSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateDateIdea(dateIdeaId, req.body);

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

exports.getDateIdeaById = async (req, res) => {
  try {
    const { dateIdeaId } = req.params;

    if (!dateIdeaId) {
      return ResponseHandler.error(res, "DateIdea Id is required", 400, {});
    }

    const response = await handleGetDateIdeaById(dateIdeaId);

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
