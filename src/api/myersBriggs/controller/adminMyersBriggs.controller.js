const {
  handleUpdateMyersBriggs,
  handleGetMyersBriggsById,
  handleCreateMyersBriggs,
} = require("@/api/myersBriggs/services/adminMyersBriggs.services");
const {
  createMyersBriggsSchema,
  updateMyersBriggsSchema,
} = require("@/api/myersBriggs/validator/adminMyersBriggs.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewMyersBriggs = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createMyersBriggsSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateMyersBriggs(name);

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

exports.updateMyersBriggs = async (req, res) => {
  try {
    const { myersBriggsId } = req.params;

    if (!myersBriggsId) {
      return ResponseHandler.error(res, "MyersBriggs Id is required", 400, {});
    }

    const { error } = await updateMyersBriggsSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateMyersBriggs(myersBriggsId, req.body);

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

exports.getMyersBriggsById = async (req, res) => {
  try {
    const { myersBriggsId } = req.params;

    if (!myersBriggsId) {
      return ResponseHandler.error(res, "MyersBriggs Id is required", 400, {});
    }

    const response = await handleGetMyersBriggsById(myersBriggsId);

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
