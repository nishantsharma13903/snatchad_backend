const {
  handleUpdateGoal,
  handleGetGoalById,
  handleCreateGoal,
} = require("@/api/goal/services/adminGoal.services");
const {
  createGoalSchema,
  updateGoalSchema,
} = require("@/api/goal/validator/adminGoal.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewGoal = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createGoalSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateGoal(name);

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

exports.updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    if (!goalId) {
      return ResponseHandler.error(res, "Goal Id is required", 400, {});
    }

    const { error } = await updateGoalSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateGoal(goalId, req.body);

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

exports.getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params;

    if (!goalId) {
      return ResponseHandler.error(res, "Goal Id is required", 400, {});
    }

    const response = await handleGetGoalById(goalId);

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
