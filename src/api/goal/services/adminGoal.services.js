const {
  createGoal,
  updateGoalById,
  checkGoalExistanceForUpdate,
  getGoalById,
  getGoalByName,
  deleteGoalByName,
} = require("@/api/goal/repository/goal.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateGoal = async (name) => {
  try {
    const existingGoal = await getGoalByName(name);

    if (existingGoal && existingGoal.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingGoal && existingGoal.status === "Delete") {
      await deleteGoalByName(name);
    }

    const newGoal = await createGoal(name);

    if (!newGoal) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating goal",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Goal created successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleUpdateGoal = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkGoalExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteGoalByName(payload?.name);
    }

    const updatedGoal = await updateGoalById(id, payload);

    if (!updatedGoal) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating goal",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Goal updated successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetGoalById = async (id) => {
  try {
    const goal = await getGoalById(id);

    if (!goal) {
      return ResponseHandler.result(404, false, "Goal not found", {});
    }

    return ResponseHandler.result(200, true, `Goal fetched successfully`, goal);
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};