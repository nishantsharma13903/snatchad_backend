const {
  handleUpdateHobby,
  handleGetHobbyById,
  handleCreateHobby,
} = require("@/api/hobby/services/adminHobby.services");
const {
  createHobbySchema,
  updateHobbySchema,
} = require("@/api/hobby/validator/adminHobby.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewHobby = async (req, res) => {
  try {
    const { name } = req.body;
    const icon = req?.file?.path || "";

    if (!icon) {
      return ResponseHandler.error(res, "Icon is required", 400, {});
    }

    const { error } = await createHobbySchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateHobby(name, icon);

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

exports.updateHobby = async (req, res) => {
  try {
    const { hobbyId } = req.params;

    if (!hobbyId) {
      return ResponseHandler.error(res, "Hobby Id is required", 400, {});
    }

    const { error } = await updateHobbySchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const payload = { ...req.body };

    const icon = req?.file?.path || "";

    if (icon) {
      payload.icon = icon;
    }

    const response = await handleUpdateHobby(hobbyId, payload);

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

exports.getHobbyById = async (req, res) => {
  try {
    const { hobbyId } = req.params;

    if (!hobbyId) {
      return ResponseHandler.error(res, "Hobby Id is required", 400, {});
    }

    const response = await handleGetHobbyById(hobbyId);

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
