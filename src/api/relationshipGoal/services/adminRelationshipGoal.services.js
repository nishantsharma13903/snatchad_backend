const {
  createRelationshipGoal,
  updateRelationshipGoalById,
  checkRelationshipGoalExistanceForUpdate,
  getRelationshipGoalById,
  getRelationshipGoalByName,
  deleteRelationshipGoalByName,
} = require("@/api/relationshipGoal/repository/relationshipGoal.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateRelationshipGoal = async (name) => {
  try {
    const existingRelationshipGoal = await getRelationshipGoalByName(name);

    if (existingRelationshipGoal && existingRelationshipGoal.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingRelationshipGoal && existingRelationshipGoal.status === "Delete") {
      await deleteRelationshipGoalByName(name);
    }

    const newRelationshipGoal = await createRelationshipGoal(name);

    if (!newRelationshipGoal) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating relationshipGoal",
        {}
      );
    }

    return ResponseHandler.result(200, true, `RelationshipGoal created successfully`, {});
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

exports.handleUpdateRelationshipGoal = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkRelationshipGoalExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteRelationshipGoalByName(payload?.name);
    }

    const updatedRelationshipGoal = await updateRelationshipGoalById(id, payload);

    if (!updatedRelationshipGoal) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating relationshipGoal",
        {}
      );
    }

    return ResponseHandler.result(200, true, `RelationshipGoal updated successfully`, {});
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

exports.handleGetRelationshipGoalById = async (id) => {
  try {
    const relationshipGoal = await getRelationshipGoalById(id);

    if (!relationshipGoal) {
      return ResponseHandler.result(404, false, "RelationshipGoal not found", {});
    }

    return ResponseHandler.result(200, true, `RelationshipGoal fetched successfully`, relationshipGoal);
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